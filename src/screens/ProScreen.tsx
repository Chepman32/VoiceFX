/**
 * Pro Screen - In-App Purchase upgrade
 */

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@/theme';
import {PressableScale} from '@/components/animated/PressableScale';
import {useStore, useIsPro} from '@/store';

const features = [
  'Unlock all voice effects',
  'Remove project limits',
  'Priority support',
  'Ad-free experience',
  'Export in all formats',
  'Advanced editing tools',
  'Custom effect creation',
  'Lifetime updates',
];

export const ProScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const isPro = useIsPro();
  const {products, addPurchase, setLoading, isLoading} = useStore();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('lifetime');

  useEffect(() => {
    // In a real app, fetch IAP products here
    // For now, we'll use mock data
  }, []);

  const handlePurchase = async () => {
    setLoading(true);

    // Simulate purchase flow
    setTimeout(() => {
      addPurchase('pro_unlock');
      setLoading(false);

      Alert.alert(
        'Purchase Successful',
        'Thank you for upgrading to Pro!',
        [
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 2000);
  };

  const handleRestore = async () => {
    setLoading(true);

    // Simulate restore
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Restore Complete', 'Your purchases have been restored');
    }, 1500);
  };

  if (isPro) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.alreadyProContainer}>
          <Text style={[styles.alreadyProTitle, {color: theme.colors.text}]}>
            You're already Pro! 🎉
          </Text>
          <Text style={[styles.alreadyProText, {color: theme.colors.textSecondary}]}>
            Thank you for your support!
          </Text>
          <PressableScale
            style={[styles.button, {backgroundColor: theme.colors.primary}]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Done</Text>
          </PressableScale>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          Upgrade to Pro
        </Text>
        <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
          Unlock the full potential of VoiceFX
        </Text>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View
                style={[
                  styles.checkmark,
                  {backgroundColor: theme.colors.success},
                ]}
              />
              <Text style={[styles.featureText, {color: theme.colors.text}]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          <PressableScale
            style={[
              styles.planCard,
              selectedPlan === 'lifetime' && {
                borderColor: theme.colors.primary,
                borderWidth: 2,
              },
              selectedPlan !== 'lifetime' && {
                backgroundColor: theme.colors.surface,
              },
            ]}
            onPress={() => setSelectedPlan('lifetime')}>
            <View style={styles.planHeader}>
              <Text style={[styles.planTitle, {color: theme.colors.text}]}>
                Lifetime
              </Text>
              <View
                style={[
                  styles.popularBadge,
                  {backgroundColor: theme.colors.success},
                ]}>
                <Text style={styles.popularText}>Best Value</Text>
              </View>
            </View>
            <Text style={[styles.planPrice, {color: theme.colors.text}]}>
              $49.99
            </Text>
            <Text style={[styles.planDescription, {color: theme.colors.textSecondary}]}>
              Pay once, own forever
            </Text>
          </PressableScale>

          <PressableScale
            style={[
              styles.planCard,
              selectedPlan === 'yearly' && {
                borderColor: theme.colors.primary,
                borderWidth: 2,
              },
              selectedPlan !== 'yearly' && {
                backgroundColor: theme.colors.surface,
              },
            ]}
            onPress={() => setSelectedPlan('yearly')}>
            <Text style={[styles.planTitle, {color: theme.colors.text}]}>
              Yearly
            </Text>
            <Text style={[styles.planPrice, {color: theme.colors.text}]}>
              $29.99/year
            </Text>
            <Text style={[styles.planDescription, {color: theme.colors.textSecondary}]}>
              Save 50% vs monthly
            </Text>
          </PressableScale>

          <PressableScale
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && {
                borderColor: theme.colors.primary,
                borderWidth: 2,
              },
              selectedPlan !== 'monthly' && {
                backgroundColor: theme.colors.surface,
              },
            ]}
            onPress={() => setSelectedPlan('monthly')}>
            <Text style={[styles.planTitle, {color: theme.colors.text}]}>
              Monthly
            </Text>
            <Text style={[styles.planPrice, {color: theme.colors.text}]}>
              $4.99/month
            </Text>
            <Text style={[styles.planDescription, {color: theme.colors.textSecondary}]}>
              Cancel anytime
            </Text>
          </PressableScale>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <PressableScale
          style={[styles.button, {backgroundColor: theme.colors.primary}]}
          onPress={handlePurchase}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Subscribe Now</Text>
          )}
        </PressableScale>

        <PressableScale
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={isLoading}>
          <Text style={[styles.restoreText, {color: theme.colors.primary}]}>
            Restore Purchases
          </Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    marginBottom: 32,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  popularBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
  },
  bottomContainer: {
    padding: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreText: {
    fontSize: 15,
    fontWeight: '500',
  },
  alreadyProContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  alreadyProTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  alreadyProText: {
    fontSize: 17,
    marginBottom: 32,
    textAlign: 'center',
  },
});
