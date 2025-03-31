#!/usr/bin/env python
import sys
import json
from PIL import Image
from transformers import ViTImageProcessor, ViTForImageClassification
import torch

# Load fine-tuned model and processor (to be trained and saved as "AvelonSkin-Model-1")
processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224')
model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224')
# Uncomment after fine-tuning:
# model = ViTForImageClassification.from_pretrained('./avelonskin-model-1')

def analyze_image(image_path):
    """
    Analyzes a skin image using AvelonSkin-Model-1 (fine-tuned ViT) to detect conditions.

    Args:
        image_path: Path to the image file

    Returns:
        Dictionary with condition and confidence score
    """
    try:
        # Load and preprocess image
        image = Image.open(image_path).convert('RGB')
        inputs = processor(images=image, return_tensors="pt")

        # Run inference
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=1)

        # Get top prediction
        confidence, predicted_idx = torch.max(probabilities, dim=1)
        confidence = confidence.item()

        # Define skin condition labels (update after fine-tuning with your dataset)
        conditions = ["eczema", "psoriasis", "acne", "rosacea", "dermatitis", "melanoma", "rash"]
        condition = conditions[predicted_idx.item()]  # Map to your fine-tuned labels

        return {
            "condition": condition,
            "confidence": round(confidence, 2)
        }

    except Exception as e:
        print(f"Error analyzing image: {str(e)}", file=sys.stderr)
        return {
            "condition": "unknown",
            "confidence": 0.0
        }

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python analyze_image.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    result = analyze_image(image_path)
    print(json.dumps(result))