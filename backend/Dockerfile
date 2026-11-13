FROM python:3.10-slim

# Bikin user dulu (Sesuai SOP Hugging Face)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR /app

# Copy requirements dan install (Pake --chown biar gak error permission)
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy sisa filenya (Model, app.py, dll)
COPY --chown=user . .

# Jalankan di port 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]