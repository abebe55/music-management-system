import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

// ── Styles ───────────────────────────────────────────────────────
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BarRow = styled.div`
  display: flex;
  gap: 4px;
`;

const BarSegment = styled.div<{ active: boolean; color: string }>`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${({ active, color }) => (active ? color : theme.colors.border)};
  transition: background ${theme.transitions.fast};
`;

const Label = styled.span<{ color: string }>`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  color: ${({ color }) => color};
`;

const RuleList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0;
  margin: 0;
`;

const Rule = styled.li<{ met: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${theme.fontSizes.xs};
  color: ${({ met }) => (met ? theme.colors.success : theme.colors.textMuted)};
  transition: color ${theme.transitions.fast};
`;

const Dot = styled.span<{ met: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid ${({ met }) => (met ? theme.colors.success : theme.colors.border)};
  background: ${({ met }) => (met ? theme.colors.success : 'transparent')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all ${theme.transitions.fast};
  color: white;
  font-size: 9px;
`;

// ── Rules ────────────────────────────────────────────────────────
interface PasswordRule {
  label: string;
  test: (pwd: string) => boolean;
}

const RULES: PasswordRule[] = [
  { label: 'At least 8 characters',       test: (p) => p.length >= 8 },
  { label: 'One uppercase letter (A–Z)',   test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter (a–z)',   test: (p) => /[a-z]/.test(p) },
  { label: 'One number (0–9)',             test: (p) => /[0-9]/.test(p) },
  { label: 'One special character (!@#…)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_CONFIG = [
  { label: 'Very weak', color: '#ef4444' },
  { label: 'Weak',      color: '#f97316' },
  { label: 'Fair',      color: '#f59e0b' },
  { label: 'Good',      color: '#10b981' },
  { label: 'Strong',    color: '#059669' },
];

// ── Component ────────────────────────────────────────────────────
interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const metCount = RULES.filter((r) => r.test(password)).length;
  const strength = Math.max(0, metCount - 1); // 0–4
  const { label, color } = STRENGTH_CONFIG[strength];

  return (
    <Wrapper>
      {/* Strength bar */}
      <BarRow>
        {STRENGTH_CONFIG.map((seg, i) => (
          <BarSegment
            key={seg.label}
            active={i <= strength}
            color={color}
          />
        ))}
      </BarRow>
      <Label color={color}>{label}</Label>

      {/* Per-rule checklist */}
      <RuleList>
        {RULES.map((rule) => {
          const met = rule.test(password);
          return (
            <Rule key={rule.label} met={met}>
              <Dot met={met}>{met ? '✓' : ''}</Dot>
              {rule.label}
            </Rule>
          );
        })}
      </RuleList>
    </Wrapper>
  );
};

export default PasswordStrength;
