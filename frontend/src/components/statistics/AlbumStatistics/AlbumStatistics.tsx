import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';
import { AlbumStat } from '../../../types/statistics';

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
  gap: 12px;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AlbumCover = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${theme.radii.md};
  background: linear-gradient(135deg, ${theme.colors.primaryLight}, #e4deff);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const AlbumName = styled.div`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArtistName = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SongCount = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
`;

interface AlbumStatisticsProps {
  data: AlbumStat[];
}

export const AlbumStatistics: React.FC<AlbumStatisticsProps> = ({ data }) => (
  <Wrapper>
    <Header>
      <Title>Top Albums</Title>
      <SubLabel>by songs</SubLabel>
    </Header>
    <List>
      {data.map((album) => (
        <Item key={`${album.album}-${album.artist}`}>
          <AlbumCover>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </AlbumCover>
          <Info>
            <AlbumName>{album.album}</AlbumName>
            <ArtistName>{album.artist}</ArtistName>
          </Info>
          <SongCount>{album.songCount} songs</SongCount>
        </Item>
      ))}
    </List>
  </Wrapper>
);
