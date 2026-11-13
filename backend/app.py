import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import json
import asyncio
from tensorflow.keras.models import load_model
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

# ── Google credentials bootstrap ─────────────────────────────────────────────
# On cloud hosts (Vercel / HF Space) the JSON key is stored as an env var.
# Write it to /tmp (always writable) and point the SDK at it.
# On local Docker the file is bind-mounted and GOOGLE_APPLICATION_CREDENTIALS
# is already set in docker-compose — don't overwrite it in that case.
if "GOOGLE_SETTINGS" in os.environ:
    _creds_path = "/tmp/google_key.json"
    with open(_creds_path, "w") as _f:
        _f.write(os.environ["GOOGLE_SETTINGS"])
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = _creds_path
    print(f" Google credentials written to {_creds_path}")

# ── CORS ──────────────────────────────────────────────────────────────────────
# Set ALLOWED_ORIGIN in your deployment env to restrict origins.
# e.g. ALLOWED_ORIGIN=https://your-app.vercel.app
# Leave unset to allow all origins (fine for dev / HF Space).
_raw_origin = os.environ.get("ALLOWED_ORIGIN", "")
_allowed_origins: list[str] = (
    [o.strip() for o in _raw_origin.split(",") if o.strip()]
    if _raw_origin
    else ["*"]
)

app = FastAPI(title="Phishing Detection API v3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=False,   # must be False when allow_origins contains "*"
    allow_methods=["*"],
    allow_headers=["*"],
)


class URLRequest(BaseModel):
    url: str


# ── Load model + processor ────────────────────────────────────────────────────
print(" Memuat Model (.h5) dan Sentence Transformer...")

MODEL_PATH = 'models/phishing_detection_deeplearning.h5'
model = None
processor = None

try:
    if os.path.exists(MODEL_PATH):
        model = load_model(MODEL_PATH)
        print(" Model Keras (.h5) siap.")
    else:
        print(" ERROR: File model (.h5) tidak ditemukan!")

    print(" Menghubungkan ke Sentence Transformer...")
    processor = SentenceTransformer('all-MiniLM-L6-v2')
    print(" Sentence Transformer siap.")
    print(" SEMUA SISTEM GO!")

except Exception as e:
    print(f" Gagal load: {str(e)}")


def _get_gcp_project_id() -> str:
    creds_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "")
    if creds_path and os.path.exists(creds_path):
        try:
            with open(creds_path) as f:
                return json.load(f).get("project_id", "")
        except Exception:
            pass
    return ""


def _submit_to_webrisk(url: str) -> None:
    from google.cloud import webrisk_v1

    project_id = _get_gcp_project_id()
    if not project_id:
        raise RuntimeError("Tidak bisa baca project_id dari GOOGLE_APPLICATION_CREDENTIALS.")

    client = webrisk_v1.WebRiskServiceClient()
    submission = webrisk_v1.Submission(uri=url)
    client.create_submission(
        parent=f"projects/{project_id}",
        submission=submission,
    )


@app.get("/")
def home():
    return {
        "status": "Ready",
        "model_loaded": model is not None,
        "processor_loaded": processor is not None,
    }


@app.post("/predict")
def predict(request: URLRequest):
    if model is None or processor is None:
        raise HTTPException(status_code=503, detail="Sistem belum siap.")

    try:
        data_vector = processor.encode([request.url])
        prediction = float(model.predict(data_vector)[0][0])

        prob_legitimate = prediction
        prob_phishing = 1 - prediction
        is_phishing = prob_phishing > 0.5

        return {
            "url": request.url,
            "label": "PHISHING" if is_phishing else "LEGITIMATE",
            "confidence": (prob_phishing if is_phishing else prob_legitimate) * 100,
            "legitimate_chance": prob_legitimate * 100,
            "is_dangerous": bool(is_phishing),
        }
    except Exception as e:
        return {"error": str(e)}


@app.post("/report")
async def report_to_google(request: URLRequest):
    creds_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "")
    if not creds_path or not os.path.exists(creds_path):
        raise HTTPException(
            status_code=500,
            detail="GOOGLE_APPLICATION_CREDENTIALS tidak dikonfigurasi atau file tidak ditemukan.",
        )

    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _submit_to_webrisk, request.url)
        return {"success": True, "message": "URL berhasil dilaporkan ke Google."}
    except Exception as exc:
        print(f"[report] Error: {exc}")
        raise HTTPException(status_code=502, detail=f"Gagal melaporkan URL: {exc}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
