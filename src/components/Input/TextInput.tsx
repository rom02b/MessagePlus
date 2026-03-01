import React, { useEffect, useRef } from 'react';
import { useCampaign } from '../../contexts/CampaignContext';
import './TextInput.css';

const TextInput: React.FC = () => {
    const { sourceContent, setSourceContent } = useCampaign();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSourceContent(e.target.value);
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [sourceContent]);

    const charCount = sourceContent.length;
    const minChars = 100;
    const isValid = charCount >= minChars;

    return (
        <div className="text-input">
            <label htmlFor="text-content" className="input-label">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Texte de votre prédication
            </label>
            <textarea
                ref={textareaRef}
                id="text-content"
                value={sourceContent}
                onChange={handleChange}
                placeholder="Collez ici le texte complet de votre homélie ou prédication..."
                className={charCount > 0 && !isValid ? 'warning' : ''}
                rows={10}
            />
            <div className="text-input-footer">
                <p className={`char-count ${isValid ? 'valid' : 'invalid'}`}>
                    {charCount} caractères {!isValid && charCount > 0 && `(minimum ${minChars})`}
                </p>
                <p className="input-hint">
                    Plus le texte est détaillé, meilleur sera le parcours généré
                </p>
            </div>
        </div>
    );
};

export default TextInput;
