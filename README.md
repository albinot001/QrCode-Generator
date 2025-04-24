# QR Code Generator

A modern and feature-rich QR code generator built with React and Chakra UI. This web application allows users to generate customizable QR codes for URLs and WiFi networks, with options to personalize colors, add logos, and manage generated QR codes.

## Features

- Real-time QR code generation for URLs and WiFi networks
- Customization options:
  - Choose custom colors for QR code
  - Add custom logos to QR codes
  - Adjust QR code size and style
- Multiple download formats:
  - PNG format for high-quality images
  - SVG format for scalable graphics
  - JPEG format for compressed files
- Multiple sharing options:
  - Copy QR code URL
  - Direct sharing functionality
- History of generated QR codes
- Clean and modern user interface
- Responsive design
- Error handling and validation

## Technologies Used

- React 18
- TypeScript
- Chakra UI
- qrcode.react
- react-router-dom
- react-icons
- react-share
- react-color
- react-dropzone
- axios
- html-to-image
- react-hot-toast

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone git@github.com:albinot001/QrCodeGenerator.git
```

2. Navigate to the project directory:

```bash
cd QrCodeGenerator
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## Usage

1. Choose the type of QR code you want to generate (URL or WiFi)
2. Enter the required information:
   - For URLs: Enter the website address
   - For WiFi: Enter network name (SSID), password, and encryption type
3. Customize your QR code:
   - Select custom colors using the color picker
   - Upload a logo to be displayed in the center of the QR code
   - Adjust the size if needed
4. Download or share your QR code:
   - Download options:
     - PNG format for high-quality images
     - SVG format for scalable graphics
     - JPEG format for compressed files
   - Copy the generated URL
   - Share directly using the share buttons
5. View your previously generated QR codes in the history section

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.
