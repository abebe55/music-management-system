import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';
import { ArtistStat } from '../../../types/statistics';

const Wrapper = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  padding: 20px 24px;
  box-shadow: ${theme.shadows.card};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textPrimary};
`;

const SubLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textMuted};
`;

const List = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Rank = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textMuted};
  width: 18px;
  flex-shrink: 0;
`;

const AvatarCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
  flex-shrink: 0;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.div`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`;

const BarBg = styled.div`
  flex: 1;
  height: 4px;
  background: ${theme.colors.borderLight};
  border-radius: 2px;
  overflow: hidden;
`;

const BarFill = styled.div<{ width: number }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background: ${theme.colors.primary};
  border-radius: 2px;
  transition: width 0.5s ease;
`;

const Count = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textMuted};
  white-space: nowrap;
`;

interface ArtistStatisticsProps {
  data: ArtistStat[];
}

export const ArtistStatistics: React.FC<ArtistStatisticsProps> = ({ data }) => {
  const maxCount = data[0]?.songCount ?? 1;

  return (
    <Wrapper>
      <Header>
        <Title>Top Artists</Title>
        <SubLabel>by songs</SubLabel>
      </Header>
      <List>
        {data.map((artist, i) => (
          <Item key={artist.artist}>
            <Rank>{i + 1}</Rank>
            <AvatarCircle>
              {artist.artist.charAt(0).toUpperCase()}
            </AvatarCircle>
            <Info>
              <Name>{artist.artist}</Name>
              <BarRow>
                <BarBg>
                  <BarFill width={(artist.songCount / maxCount) * 100} />
                </BarBg>
                <Count>{artist.songCount} songs</Count>
              </BarRow>
            </Info>
          </Item>
        ))}
      </List>
    </Wrapper>
  );
};
