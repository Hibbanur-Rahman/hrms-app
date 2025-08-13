# PDF Salary Slip Viewer and Downloader

This document describes the implementation of PDF viewing and downloading functionality for salary slips in the HRMS app.

## Features

### PDF Viewing
- **In-app PDF viewer**: Uses `react-native-pdf` library to display PDFs directly within the app
- **Full-screen modal**: PDFs open in a dedicated full-screen modal with navigation controls
- **Page navigation**: Shows current page and total pages at the bottom
- **Zoom controls**: Supports pinch-to-zoom, double-tap to zoom, and zoom limits (0.5x to 3x)
- **Loading states**: Shows loading indicators while processing

### PDF Downloading
- **Local storage**: Downloads PDFs to the device's Downloads folder
- **Permission handling**: Automatically requests storage permissions on Android
- **File naming**: Generates unique filenames with timestamps
- **Progress feedback**: Shows download progress and completion alerts
- **Open downloaded file**: Option to open the downloaded file directly

### User Interface
- **Loading indicators**: Shows ActivityIndicator while viewing or downloading
- **Error handling**: Comprehensive error messages for various failure scenarios
- **Disabled states**: Prevents multiple simultaneous operations on the same file

## Implementation Details

### Components
- `SalarySlipPDFViewer.tsx`: Main PDF viewer component with download and share functionality
- `home.tsx`: Contains the salary slip list with view and download buttons

### Permissions Required (Android)
```xml
<!-- File operations -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />
<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />

<!-- Downloading -->
<uses-permission android:name="android.permission.DOWNLOAD_WITHOUT_NOTIFICATION" />

<!-- Opening external apps -->
<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />

<!-- Package visibility (Android 11+) -->
<queries>
    <intent>
        <action android:name="android.intent.action.VIEW" />
        <data android:mimeType="application/pdf" />
    </intent>
    <intent>
        <action android:name="android.intent.action.SEND" />
        <data android:mimeType="application/pdf" />
    </intent>
</queries>
```

### File Provider Configuration
The app includes a FileProvider for secure file sharing:
- Provider authority: `${applicationId}.fileprovider`
- Configuration file: `res/xml/file_paths.xml`
- Supports internal files, external files, cache, and downloads directories

### API Data Handling
The implementation handles various PDF data formats:
- **Base64 encoded**: Most common format from APIs
- **Raw PDF data**: Direct PDF content starting with '%PDF'
- **Nested response objects**: Extracts PDF data from `response.data.data` structure

### Error Scenarios Handled
1. **No PDF viewer app**: Prompts user to install a PDF viewer
2. **Storage permission denied**: Shows permission required message
3. **Invalid PDF data**: Validates data format before processing
4. **Network errors**: Shows appropriate error messages
5. **File write errors**: Handles storage issues gracefully

## Usage

### Viewing a Salary Slip
1. Tap the eye icon next to a salary slip
2. PDF loads in full-screen viewer
3. Navigate pages, zoom, and use share/download options
4. Tap X to close the viewer

### Downloading a Salary Slip
1. Tap the download icon next to a salary slip
2. Grant storage permission if prompted
3. File downloads to Downloads folder
4. Option to open the downloaded file

### Sharing a Salary Slip
1. Open the PDF viewer
2. Tap the share icon in the header
3. Choose sharing method from device options

## Technical Dependencies
- `react-native-pdf`: For PDF rendering
- `react-native-blob-util`: For file operations
- `react-native-vector-icons`: For UI icons
- Built-in React Native components for permissions and sharing

## File Structure
```
src/
├── components/
│   └── SalarySlipPDFViewer.tsx
├── screens/
│   └── home/
│       └── home.tsx
└── services/
    └── SalarySlipService.tsx

android/
└── app/
    └── src/
        └── main/
            ├── AndroidManifest.xml
            └── res/
                └── xml/
                    └── file_paths.xml
```

## Future Enhancements
- Search within PDF
- Annotation support
- Multiple file selection for batch download
- Cloud storage integration
- Print functionality
