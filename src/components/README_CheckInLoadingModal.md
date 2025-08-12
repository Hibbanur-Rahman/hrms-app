# CheckInLoadingModal Component

A professional, animated loading modal component designed specifically for check-in/check-out processes in HRMS applications.

## Features

- **Animated Icon Sequence**: Displays a sequence of professional icons with smooth transitions
- **Progress Tracking**: Visual progress bar and step indicators
- **Professional UI**: Modern design with smooth animations and professional styling
- **Customizable**: Supports both check-in and check-out modes
- **Real-time Sync**: Synchronizes with actual API call progress
- **Accessibility**: Proper status bar handling and user feedback

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | - | Controls modal visibility |
| `onClose` | `() => void` | - | Callback when user manually closes modal |
| `type` | `'checkin' \| 'checkout'` | `'checkin'` | Type of operation being performed |
| `onComplete` | `() => void` | - | Callback when animation sequence completes |
| `isProcessing` | `boolean` | `true` | Whether API call is still in progress |

## Usage

```tsx
import CheckInLoadingModal from '../components/CheckInLoadingModal';

const [showLoadingModal, setShowLoadingModal] = useState(false);
const [loadingType, setLoadingType] = useState<'checkin' | 'checkout'>('checkin');
const [isProcessing, setIsProcessing] = useState(false);

const handleCheckIn = async () => {
  try {
    setLoadingType('checkin');
    setShowLoadingModal(true);
    setIsProcessing(true);
    
    // Your API call here
    const response = await AttendanceService.CheckIn(payload);
    
    if (response.status === 200) {
      setIsProcessing(false);
      // Modal will automatically show success and call onComplete
    }
  } catch (error) {
    setShowLoadingModal(false);
    setIsProcessing(false);
    // Handle error
  }
};

const handleCheckInComplete = () => {
  setShowLoadingModal(false);
  // Show success message or navigate
};

return (
  <CheckInLoadingModal
    visible={showLoadingModal}
    type={loadingType}
    onClose={() => setShowLoadingModal(false)}
    onComplete={handleCheckInComplete}
    isProcessing={isProcessing}
  />
);
```

## Animation Sequence

### Check-in Process:
1. **Location Icon** - "Getting your location..."
2. **WiFi Icon** - "Connecting to server..."
3. **Shield Icon** - "Verifying credentials..."
4. **Check Circle** - "Check-in successful!"

### Check-out Process:
1. **Clock Icon** - "Calculating work hours..."
2. **WiFi Icon** - "Sending data to server..."
3. **Shield Icon** - "Securing your session..."
4. **Check Circle** - "Check-out successful!"

## Design Features

- **Smooth Transitions**: Each icon animates in with scale, rotation, and opacity effects
- **Progress Bar**: Animated progress bar that fills during the process
- **Step Indicators**: Visual dots showing current step progress
- **Pulse Animation**: Subtle pulse effect on the modal container
- **Professional Colors**: Each step uses appropriate colors (blue, green, orange, green)
- **Responsive Design**: Adapts to different screen sizes
- **Status Bar Integration**: Proper status bar handling for modal overlay

## Technical Implementation

- Built with React Native Reanimated for smooth 60fps animations
- Uses Lucide React Native icons for consistency
- Implements proper cleanup and state management
- Supports both light and dark mode considerations
- Optimized for performance with minimal re-renders

## Customization

The component can be easily customized by modifying:
- Icon sequences and durations
- Colors and styling
- Animation timing and effects
- Text content and messaging
- Progress bar behavior

## Best Practices

1. **Always handle errors**: Make sure to set `isProcessing` to false and close modal on errors
2. **Provide user feedback**: Use the `onComplete` callback to show success messages
3. **Don't block user**: Allow users to close modal if needed (unless critical)
4. **Sync with API**: Use `isProcessing` to sync modal state with actual API progress
5. **Test thoroughly**: Ensure animations work smoothly on different devices
