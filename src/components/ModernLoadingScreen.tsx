import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface LoadingStep {
  icon: string;
  text: string;
  duration: number;
}

const loadingSteps: LoadingStep[] = [
  { icon: '🔐', text: 'Initializing Security Protocols', duration: 800 },
  { icon: '⚙️', text: 'Loading System Configuration', duration: 800 },
  { icon: '👤', text: 'Authenticating User Credentials', duration: 1000 },
  { icon: '📊', text: 'Synchronizing Data Sources', duration: 800 },
  { icon: '🔍', text: 'Validating Permissions', duration: 700 },
  { icon: '📱', text: 'Preparing User Interface', duration: 600 },
  { icon: '✅', text: 'System Ready!', duration: 500 },
];

const ModernLoadingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [slideAnim] = useState(new Animated.Value(50));
  const [progressAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [backgroundAnim] = useState(new Animated.Value(0));
  const [shimmerAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Continuous pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Background animation
    const backgroundAnimation = Animated.loop(
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    );
    backgroundAnimation.start();

    // Shimmer animation
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      })
    );
    shimmerAnimation.start();

    const animateStep = () => {
      if (currentStep < loadingSteps.length) {
        // Reset animations
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.8);
        slideAnim.setValue(50);

        // Animate in with easing
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();

        // Animate progress bar with easing
        Animated.timing(progressAnim, {
          toValue: ((currentStep + 1) / loadingSteps.length) * 100,
          duration: loadingSteps[currentStep].duration,
          useNativeDriver: false,
        }).start();

        // Move to next step after duration
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, loadingSteps[currentStep].duration);
      }
    };

    animateStep();

    return () => {
      pulseAnimation.stop();
      backgroundAnimation.stop();
      shimmerAnimation.stop();
    };
  }, [currentStep, fadeAnim, scaleAnim, slideAnim, progressAnim, pulseAnim, backgroundAnim, shimmerAnim]);

  const currentStepData = loadingSteps[currentStep] || loadingSteps[loadingSteps.length - 1];

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        {[...Array(20)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.patternDot,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                opacity: Math.random() * 0.3 + 0.1,
                transform: [
                  {
                    scale: Animated.multiply(
                      pulseAnim,
                      Animated.add(0.8, Math.random() * 0.4)
                    ),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Animated Overlay */}
      <Animated.View
        style={[
          styles.animatedOverlay,
          {
            opacity: backgroundAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
          },
        ]}
      />

      {/* Main Content */}
      <View style={styles.content}>
        {/* App Logo/Icon */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.logoIconContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Text style={styles.logoIcon}>🏢</Text>
          </Animated.View>
          <Text style={styles.appName}>SPIRIT HRMS</Text>
          <Text style={styles.appSubtitle}>Human Resource Management System</Text>
        </Animated.View>

        {/* Loading Animation */}
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          <Text style={styles.stepIcon}>{currentStepData.icon}</Text>
          <Text style={styles.stepText}>{currentStepData.text}</Text>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.progressGlow,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.progressShimmer,
                {
                  left: shimmerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['-100%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {Math.round(((currentStep + 1) / loadingSteps.length) * 100)}%
            </Text>
            <Text style={styles.progressStep}>
              Step {currentStep + 1} of {loadingSteps.length}
            </Text>
          </View>
        </View>

        {/* Loading Dots */}
        <View style={styles.dotsContainer}>
          {[...Array(3)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      scale: Animated.multiply(
                        scaleAnim,
                        Animated.add(1, Animated.multiply(pulseAnim, 0.2))
                      ),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>

             {/* Footer */}
       <View style={styles.footer}>
         <Text style={styles.footerText}>Powered by Modern HR Solutions</Text>
       </View>
     </View>
   );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  patternDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  animatedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoIconContainer: {
    marginBottom: 16,
    padding: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  logoIcon: {
    fontSize: 80,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(102, 126, 234, 0.7)',
    fontFamily: 'Poppins-Regular',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  stepIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  stepText: {
    fontSize: 18,
    color: '#667eea',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 40,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 4,
  },
  progressGlow: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
    borderRadius: 4,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  progressShimmer: {
    position: 'absolute',
    height: '100%',
    width: '50%',
    backgroundColor: 'rgba(102, 126, 234, 0.4)',
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#667eea',
    fontFamily: 'Poppins-Bold',
  },
  progressStep: {
    fontSize: 12,
    color: 'rgba(102, 126, 234, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(102, 126, 234, 0.6)',
    fontFamily: 'Poppins-Regular',
  },
});

export default ModernLoadingScreen;
