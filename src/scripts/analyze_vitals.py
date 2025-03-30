#!/usr/bin/env python
import sys
import json
import re

def analyze_vitals(vitals_text):
    """
    Mock vitals analysis function that simulates AI detection of vital sign anomalies.
    For a real implementation, this would use a Bio-RoBERTa model.
    
    Args:
        vitals_text: Text containing vital sign information
        
    Returns:
        Dictionary with alerts based on vital analysis
    """
    try:
        # Simple regex-based vital sign extraction
        # Heart rate (HR) extraction
        hr_match = re.search(r'HR\s*[=:]*\s*(\d+)', vitals_text, re.IGNORECASE)
        hr = int(hr_match.group(1)) if hr_match else None
        
        # Temperature extraction
        temp_match = re.search(r'temp\s*[=:]*\s*(\d+\.?\d*)', vitals_text, re.IGNORECASE)
        temp = float(temp_match.group(1)) if temp_match else None
        
        # Blood pressure extraction
        bp_match = re.search(r'BP\s*[=:]*\s*(\d+)[/\\](\d+)', vitals_text, re.IGNORECASE)
        systolic = int(bp_match.group(1)) if bp_match else None
        diastolic = int(bp_match.group(2)) if bp_match else None
        
        # Analyze vitals for anomalies
        alerts = []
        
        if hr is not None:
            if hr > 100:
                alerts.append("High heart rate")
            elif hr < 60:
                alerts.append("Low heart rate")
                
        if temp is not None:
            if temp > 37.5:
                alerts.append("Fever")
            elif temp < 36:
                alerts.append("Low body temperature")
                
        if systolic is not None and diastolic is not None:
            if systolic > 140 or diastolic > 90:
                alerts.append("High blood pressure")
            elif systolic < 90 or diastolic < 60:
                alerts.append("Low blood pressure")
        
        return {
            "alerts": ", ".join(alerts) if alerts else None
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
    
    # Print JSON result to stdout for the Node.js process to capture
    print(json.dumps(result)) 