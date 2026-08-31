import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { statisticsActions } from '../../features/statistics/statistics.slice';
import {
  selectStatistics, selectStatisticsLoading, selectStatisticsError,
} from '../../features/statistics/statistics.selectors';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import { StatisticsCard } from '../../components/statistics/StatisticsCard/StatisticsCard';
import { GenreStatistics } from '../../components/statistics/GenreStatistics/GenreStatistics';
import { ArtistStatistics } from '../../components/statistics/ArtistStatistics/ArtistStatistics';
import { AlbumStatistics } from '../../components/statistics/AlbumStatistics/AlbumStatistics';
import { Spinner } from '../../components/common/Spinner/Spinner';
import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { theme } from '../../styles/theme';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 10px;

  @media (max-width: ${theme.breakpoints.lg}) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: ${theme.breakpoints.sm}) { grid-template-columns: 1fr; }
`;

const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;

  @media (max-width: ${theme.breakpoints.lg}) { grid-template-columns: 1fr; }
`;

const FullSection = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  padding: 20px 24px;
  box-shadow: ${theme.shadows.card};
  margin-bottom: 10px;
`;

const SectionTitle = styled.h3`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textPrimary};
  margin-bottom: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${theme.fontSizes.sm};
`;

const Th = styled.th`
  padding: 10px 12px;
  text-align: left;
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid ${theme.colors.border};
`;

const Td = styled.td`
  padding: 12px 12px;
  border-bottom: 1px solid ${theme.colors.border};
  color: ${theme.colors.textPrimary};

  &:last-child { color: ${theme.colors.textMuted}; font-weight: ${theme.fontWeights.medium}; }
`;

const StatisticsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectStatistics);
  const isLoading = useAppSelector(selectStatisticsLoading);
  const error = useAppSelector(selectStatisticsError);

  useEffect(() => {
    dispatch(statisticsActions.fetchStatisticsRequest());
  }, [dispatch]);

  return (
    <MainLayout>

      {isLoading && <Spinner centered />}
      {error && (
        <ErrorState
          message={error}
          onRetry={() => dispatch(statisticsActions.fetchStatisticsRequest())}
        />
      )}

      {stats && !isLoading && (
        <>
          <StatsGrid>
            <StatisticsCard
              label="Total Songs"
              value={stats.totals.songs}
              iconBg="#f0eeff"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              }
            />
            <StatisticsCard
              label="Total Artists"
              value={stats.totals.artists}
              iconBg="#fff0f6"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.colors.secondary} strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
              }
            />
            <StatisticsCard
              label="Total Albums"
              value={stats.totals.albums}
              iconBg="#eff6ff"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.colors.info} strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                </svg>
              }
            />
            <StatisticsCard
              label="Total Genres"
              value={stats.totals.genres}
              iconBg="#f0fdf4"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.colors.success} strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                  <line x1="2" y1="20" x2="22" y2="20"/>
                </svg>
              }
            />
          </StatsGrid>

          <TwoColGrid>
            <GenreStatistics data={stats.byGenre} />
            <ArtistStatistics data={stats.topArtists} />
          </TwoColGrid>

          <TwoColGrid>
            <AlbumStatistics data={stats.topAlbums} />

            {/* Genre breakdown table */}
            <FullSection style={{ margin: 0 }}>
              <SectionTitle>Songs per Genre</SectionTitle>
              <Table>
                <thead>
                  <tr>
                    <Th>Genre</Th>
                    <Th>Songs</Th>
                    <Th>% of Library</Th>
                  </tr>
                </thead>
                <tbody>
                  {stats.byGenre.map((g) => (
                    <tr key={g.genre}>
                      <Td>{g.genre}</Td>
                      <Td>{g.count}</Td>
                      <Td>
                        {stats.totals.songs > 0
                          ? `${((g.count / stats.totals.songs) * 100).toFixed(1)}%`
                          : '0%'}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </FullSection>
          </TwoColGrid>

          {/* Full artist table */}
          <FullSection>
            <SectionTitle>All Artists</SectionTitle>
            <Table>
              <thead>
                <tr>
                  <Th>#</Th>
                  <Th>Artist</Th>
                  <Th>Songs</Th>
                  <Th>Albums</Th>
                </tr>
              </thead>
              <tbody>
                {stats.byArtist.map((a, i) => (
                  <tr key={a.artist}>
                    <Td style={{ color: theme.colors.textMuted, width: 40 }}>{i + 1}</Td>
                    <Td style={{ fontWeight: 500 }}>{a.artist}</Td>
                    <Td>{a.songCount}</Td>
                    <Td>{a.albumCount}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </FullSection>
        </>
      )}
    </MainLayout>
  );
};

export default StatisticsPage;


