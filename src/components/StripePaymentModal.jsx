'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, Lock, ShieldCheck, CreditCard, ShoppingBag, User, Calendar, Clock, Loader2, AlertCircle } from 'lucide-react';

// Initialize Stripe outside of component render to avoid recreation
const getStripeKey = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51OwWn0SFLbC5C7wT3fLwL4Z7w6Lg7V8J2z7K8F9Y9G6E6D5D4C3B2A1';
};
const stripePromise = loadStripe(getStripeKey());

function CheckoutForm({ bookingData, onClose, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const successUrl = `${window.location.origin}/payment/success?` + 
      `service=${encodeURIComponent(bookingData.service_type)}` +
      `&amount=${bookingData.total_payable}` +
      `&worker=${encodeURIComponent(bookingData.worker_name)}` +
      `&booking_id=${bookingData.booking_id}` +
      `&datetime=${encodeURIComponent(bookingData.booking_date + ', ' + bookingData.booking_time)}` +
      `&method=Stripe`;

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: successUrl,
        },
        redirect: 'if_required',
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Direct client side navigation since payment completed without full-page redirect
        onPaymentSuccess();
        router.push(`${successUrl}&payment_id=${paymentIntent.id}`);
      } else {
        // Fallback for payment types that always require redirect (e.g. SEPA/Sofort)
        setIsProcessing(false);
      }
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong. Please check your card info.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5.5 text-left w-full">
      {/* Stripe Payment Input */}
      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
        <PaymentElement 
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                address: {
                  country: 'DE',
                }
              }
            }
          }}
        />
      </div>

      {errorMessage && (
        <div className="flex gap-2 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 font-sans font-bold text-[12px] leading-relaxed">
          <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Pay CTA Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-4 px-6 rounded-xl font-sans font-extrabold text-[14px] text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
          isProcessing || !stripe
            ? 'bg-slate-400 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-[#137DC5] to-[#0D6EFD] hover:shadow-[#137DC5]/20 hover:-translate-y-0.5 active:translate-y-0'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 text-blue-100" />
            <span>Pay €{bookingData.total_payable.toFixed(2)} Securely</span>
          </>
        )}
      </button>

      {/* Security note */}
      <div className="flex items-center justify-center gap-1.5 text-slate-400 font-sans font-semibold text-[11px] select-none">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Payments are encrypted and processed securely by Stripe.</span>
      </div>
    </form>
  );
}

export default function StripePaymentModal({ isOpen, clientSecret, bookingData, onClose, onPaymentSuccess }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !clientSecret) return null;

  const elementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#137DC5',
        colorBackground: '#ffffff',
        colorText: '#092040',
        colorDanger: '#df1b41',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '12px',
        spacingUnit: '4px',
      },
    },
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 transition-all duration-300"
    >
      <div className="bg-white w-full md:max-w-[500px] max-h-[95vh] md:max-h-[85vh] rounded-t-3xl md:rounded-2xl shadow-[0_15px_50px_rgba(9,32,64,0.15)] border-t md:border border-slate-100 flex flex-col overflow-hidden animate-slideUp md:animate-none">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#137DC5]" />
            <h3 className="font-display font-extrabold text-[16px] text-[#092040] tracking-tight">Secure Payment</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable if needed */}
        <div className="flex-grow overflow-y-auto no-scrollbar px-6 py-5 flex flex-col gap-5">
          {/* Booking Summary Card */}
          <div className="bg-[#FAFBFD] border border-slate-100 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#137DC5] flex-shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="flex-grow min-w-0 text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Service</p>
                <p className="text-[12.5px] font-extrabold text-[#092040] truncate">{bookingData.service_type}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Booking ID</p>
                <p className="text-[12px] font-bold text-slate-600">{bookingData.booking_id}</p>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="grid grid-cols-2 gap-3 text-left">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3 h-3 text-[#137DC5]" /> Worker
                </p>
                <p className="text-[12px] font-extrabold text-slate-700 truncate mt-0.5">{bookingData.worker_name}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#137DC5]" /> Schedule
                </p>
                <p className="text-[11.5px] font-bold text-slate-700 truncate mt-0.5 flex items-center gap-1">
                  <span>{bookingData.booking_date}</span>
                  <span className="text-slate-300">•</span>
                  <span>{bookingData.booking_time}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Stripe Elements Provider Wrapper */}
          <Elements stripe={stripePromise} options={elementsOptions}>
            <CheckoutForm
              bookingData={bookingData}
              onClose={onClose}
              onPaymentSuccess={onPaymentSuccess}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}
