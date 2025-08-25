#!/usr/bin/env python3
"""
QR Code Generator Script
Generates QR codes from text input and returns base64 encoded image
"""

import sys
import qrcode
import io
import base64
from PIL import Image
import json

def generate_qr_code(text, size=400, border=4):
    """
    Generate QR code from text and return as base64 string
    
    Args:
        text (str): Text to encode in QR code
        size (int): Size of the QR code image
        border (int): Border size around QR code
    
    Returns:
        str: Base64 encoded PNG image
    """
    try:
        # Create QR code instance
        qr = qrcode.QRCode(
            version=1,  # Controls the size of the QR Code
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=border,
        )
        
        # Add data to QR code
        qr.add_data(text)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Resize image to specified size
        img = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG', optimize=True)
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        # Return as data URL
        return f"data:image/png;base64,{img_str}"
        
    except Exception as e:
        raise Exception(f"QR code generation failed: {str(e)}")

def main():
    """Main function to handle command line arguments"""
    try:
        if len(sys.argv) < 2:
            print(json.dumps({
                "error": "No text provided",
                "usage": "python qrcode_generator.py 'text to encode'"
            }))
            sys.exit(1)
        
        # Get text from command line argument
        text = sys.argv[1]
        
        if not text.strip():
            print(json.dumps({
                "error": "Empty text provided"
            }))
            sys.exit(1)
        
        # Generate QR code
        qr_data_url = generate_qr_code(text.strip())
        
        # Return success response
        result = {
            "success": True,
            "qr": qr_data_url,
            "text": text.strip(),
            "timestamp": "generated"
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        # Return error response
        error_result = {
            "success": False,
            "error": str(e),
            "text": sys.argv[1] if len(sys.argv) > 1 else ""
        }
        
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()
