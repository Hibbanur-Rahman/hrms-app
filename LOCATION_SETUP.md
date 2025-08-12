# Location-Based Check-in Setup Guide

This guide will help you set up the location-based check-in feature for your HRMS app.

## Prerequisites

1. **Google Maps API Key**: You need a Google Maps API key with the following APIs enabled:
   - Geocoding API
   - Places API (optional, for better address results)

## Setup Steps

### 1. Get Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Geocoding API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Geocoding API"
   - Click on it and press "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

### 2. Configure API Key

1. Open `src/config/googleMapsConfig.ts`
2. Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:

```typescript
export const GOOGLE_MAPS_CONFIG = {
  API_KEY: 'your_actual_api_key_here',
  // ... rest of the config
};
```

### 3. Android Permissions Setup

Add the following permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
```

### 4. iOS Permissions Setup

Add the following to `ios/HRMSAPP/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs access to your location for attendance tracking.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>This app needs access to your location for attendance tracking.</string>
```

## How It Works

### Check-in Process

1. **Permission Request**: The app requests location permissions from the user
2. **Location Retrieval**: Gets current GPS coordinates (latitude/longitude)
3. **Address Resolution**: Uses Google Maps Geocoding API to convert coordinates to human-readable address
4. **Backend Submission**: Sends location data to your backend API

### Data Structure

The check-in payload includes:

```typescript
{
  address: string,      // Human-readable address from Google Maps
  latitude: number,     // GPS latitude coordinate
  longitude: number     // GPS longitude coordinate
}
```

## Error Handling

The app handles the following scenarios:

- **Permission Denied**: Shows alert asking user to enable location permissions
- **Location Unavailable**: Shows error message and allows retry
- **Network Issues**: Gracefully handles API failures
- **Invalid Coordinates**: Provides fallback address

## Testing

1. **Simulator Testing**: Use iOS Simulator or Android Emulator with location simulation
2. **Device Testing**: Test on physical device with GPS enabled
3. **Permission Testing**: Test both granted and denied permission scenarios

## Security Considerations

1. **API Key Security**: 
   - Restrict your Google Maps API key to your app's bundle ID
   - Set up API key restrictions in Google Cloud Console
   - Consider using environment variables for production

2. **Location Privacy**:
   - Only request location when needed for check-in
   - Don't store location data unnecessarily
   - Follow privacy regulations (GDPR, etc.)

## Troubleshooting

### Common Issues

1. **"Address not found" error**:
   - Check if Google Maps API key is valid
   - Verify Geocoding API is enabled
   - Check API quota limits

2. **Permission denied**:
   - Ensure permissions are properly configured in manifest files
   - Check if user manually denied permissions in device settings

3. **Location timeout**:
   - Increase timeout values in LocationService
   - Check GPS signal strength
   - Ensure device has internet connection

### Debug Mode

Enable debug logging by adding console.log statements in LocationService methods to troubleshoot issues.

## API Limits

- Google Maps Geocoding API has usage limits
- Monitor your API usage in Google Cloud Console
- Consider implementing caching for frequently accessed locations
- Implement rate limiting if needed

## Cost Considerations

- Google Maps Geocoding API has pricing based on usage
- Monitor your usage to avoid unexpected charges
- Consider implementing address caching to reduce API calls
