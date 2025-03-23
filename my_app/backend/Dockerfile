# Use Python as the base image
FROM python:3.11

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy only the backend files
COPY backend/ .

# Expose the Flask port
EXPOSE 5001

# Start Flask
CMD ["python", "app.py"]