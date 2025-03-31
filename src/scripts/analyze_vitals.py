#!/usr/bin/env python
import sys
import json
from transformers import RobertaTokenizer, RobertaForSequenceClassification
import torch

# Load fine-tuned model and tokenizer (to be trained and saved as "AvelonVitals-Model-1")
tokenizer = RobertaTokenizer.from_pretrained('biomed-roberta-base')
model = RobertaForSequenceClassification.from_pretrained('biomed-roberta-base')
# Uncomment after fine-tuning:
# model = RobertaForSequenceClassification.from_pretrained('./avelonvitals-model-1')

def analyze_vitals(vitals_text):
    """
    Analyzes vital signs text using AvelonVitals-Model-1 (fine-tuned Bio-RoBERTa) for anomalies.

    Args:
        vitals_text: Text containing vital sign information (e.g., "HR 120, Temp 38°C")

    Returns:
        Dictionary with detected alerts
    """
    try:
        # Preprocess text
        inputs = tokenizer(vitals_text, return_tensors="pt", truncation=True, padding=True, max_length=128)

        # Run inference
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=1)

        # Define alert labels (binary: normal/abnormal; update after fine-tuning)
        alert_labels = ["normal", "abnormal"]
        confidence, predicted_idx = torch.max(probabilities, dim=1)
        prediction = alert_labels[predicted_idx.item()]

        # Map abnormal prediction to specific alerts (fine-tune for multi-label later)
        alerts = None
        if prediction == "abnormal":
            # Mock alerts until fine-tuned for specific conditions
            alerts = "Potential anomaly detected"

        return {
            "alerts": alerts
        }

    except Exception as e:
        print(f"Error analyzing vitals: {str(e)}", file=sys.stderr)
        return {
            "alerts": None
        }

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python analyze_vitals.py <vitals_text>")
        sys.exit(1)

    vitals_text = sys.argv[1]
    result = analyze_vitals(vitals_text)
    print(json.dumps(result))