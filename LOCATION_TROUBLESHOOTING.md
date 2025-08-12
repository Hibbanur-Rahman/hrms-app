# Location Troubleshooting Guide

## Common Issues and Solutions

### 1. Location Timeout Error

**Error**: `Location request timed out`

**Causes**:
- Testing in emulator/simulator without location simulation
- Poor GPS signal
- Device location services disabled
- Network connectivity issues

**Solutions**:

#### For Android Emulator:
1. Open Android Studio
2. Go to Tools > AVD Manager
3. Click the pencil icon next to your emulator
4. Click "Show Advanced Settings"
5. Under "Emulated Performance", set "Graphics" to "Hardware - GLES 2.0"
6. Under "Location", set a custom location or use GPS coordinates
7. Restart the emulator

#### For iOS Simulator:
1. Open Xcode
2. Go to Features > Location
3. Choose a preset location or set a custom location
4. Or use the Debug menu: Debug > Location > Custom Location

#### For Physical Device:
1. Ensure GPS is enabled in device settings
2. Go outside or near a window for better GPS signal
3. Check if location services are enabled for your app
4. Try turning airplane mode on/off to reset GPS

### 2. Testing Steps

#### Step 1: Test Basic Location
Use the LocationTest component in your app to test:
- Tap "Test Location" button
- Check console logs for detailed information
- Look for specific error messages

#### Step 2: Check Permissions
- Ensure location permissions are granted
- Check device settings for your app
- Try uninstalling and reinstalling the app

#### Step 3: Test GPS Signal
- Use Google Maps app to verify GPS works
- Check if other location-based apps work
- Try different locations (indoor vs outdoor)

### 3. Debug Information

The app now provides detailed logging. Check the console for:

```
Requesting location...
hasPermission true
Attempting to get current location...
position { coords: { latitude: X, longitude: Y } }
```

### 4. Configuration Check

Verify your setup:

1. **Google Maps API Key**: Check `src/config/env.ts`
   - Should have a valid API key
   - API key should have Geocoding API enabled

2. **Permissions**: Check manifest files
   - Android: `android/app/src/main/AndroidManifest.xml`
   - iOS: `ios/HRMSAPP/Info.plist`

3. **Dependencies**: Ensure these are installed
   ```bash
   npm install @react-native-community/geolocation react-native-permissions
   ```

### 5. Alternative Testing Methods

#### Method 1: Use Simulated Location
- Set a fixed location in emulator/simulator
- This bypasses GPS signal issues

#### Method 2: Test on Physical Device
- Use a real device with GPS
- Test outdoors for best signal

#### Method 3: Mock Location Data
For development, you can temporarily hardcode location:

```typescript
// In LocationService.tsx, temporarily replace getCurrentLocation
getCurrentLocation = (): Promise<LocationData> => {
  return Promise.resolve({
    latitude: 40.7128, // New York coordinates
    longitude: -74.0060,
  });
};
```

### 6. Performance Tips

1. **Reduce Timeout**: If testing in emulator, reduce timeout to 10 seconds
2. **Disable High Accuracy**: Use `enableHighAccuracy: false` for faster response
3. **Increase Maximum Age**: Use cached location when possible

### 7. Common Error Codes

- **Code 1**: Permission denied
- **Code 2**: Position unavailable
- **Code 3**: Timeout
- **Code 4**: Activity is null

### 8. Next Steps

1. Try the LocationTest component first
2. Check console logs for specific error messages
3. Test on a physical device if possible
4. Verify Google Maps API key is working
5. Check network connectivity

### 9. Emergency Fallback

If location continues to fail, you can implement a fallback:

```typescript
// In handleCheckIn, add fallback coordinates
const handleCheckIn = async () => {
  try {
    const locationData = await LocationService.getLocationWithAddress();
    // ... use locationData
  } catch (error) {
    // Fallback to default location
    const fallbackLocation = {
      address: 'Location unavailable',
      latitude: 0,
      longitude: 0,
    };
    // ... use fallbackLocation
  }
};
```

## Quick Test Checklist

- [ ] Location permissions granted
- [ ] GPS enabled on device
- [ ] Testing on physical device or with location simulation
- [ ] Google Maps API key configured
- [ ] Network connectivity available
- [ ] App has location permissions in device settings
