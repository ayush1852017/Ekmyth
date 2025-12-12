import React, { useState } from 'react';

interface OnboardingProps {
    onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "Welcome to Ekmyth",
            description: "The fun, friendly way to separate fact from fiction.",
            icon: "👋",
            color: "var(--color-truth-blue)"
        },
        {
            title: "Spot the Myth",
            description: "Scroll through daily myths. See what's BUSTED and what's VERIFIED.",
            icon: "🔍",
            color: "var(--color-curiosity-yellow)"
        },
        {
            title: "Verify with AI",
            description: "Not sure about a rumor? Submit it and our AI will check the facts for you!",
            icon: "🤖",
            color: "var(--color-myth-red)"
        }
    ];

    const CurrentStep = steps[step];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'var(--color-background)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                borderBottomWidth: '6px' 
            }}>
                <div style={{
                    fontSize: '4rem',
                    marginBottom: '1rem',
                    animation: 'float 3s ease-in-out infinite'
                }}>
                    {CurrentStep.icon}
                </div>

                <h2 style={{ 
                    fontSize: '1.75rem', 
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.5rem' 
                }}>
                    {CurrentStep.title}
                </h2>
                
                <p style={{ 
                    fontSize: '1.1rem', 
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5
                }}>
                    {CurrentStep.description}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
                    {steps.map((_, i) => (
                        <div key={i} style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: i === step ? CurrentStep.color : 'var(--color-divider)',
                            transition: 'all 0.3s'
                        }}></div>
                    ))}
                </div>

                <button 
                    onClick={handleNext} 
                    className="btn btn-primary"
                    style={{ width: '100%', background: CurrentStep.color, borderColor: 'rgba(0,0,0,0.1)' }}
                >
                    {step === steps.length - 1 ? "Let's Go!" : "Continue"}
                </button>
                
                {step < steps.length - 1 && (
                    <button 
                        onClick={onComplete}
                        style={{ 
                            background: 'none', 
                            border: 'none',
                            color: 'var(--color-text-light)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                        }}
                    >
                        Skip
                    </button>
                )}
            </div>

            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    );
};

export default Onboarding;
