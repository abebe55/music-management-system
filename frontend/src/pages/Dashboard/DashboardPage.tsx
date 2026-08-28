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

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.textPrimary};
`;

const PageSubtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textMuted};
  margin-top: 4px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: ${theme.breakpoints.lg}) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: ${theme.breakpoints.sm}) { grid-template-columns: 1fr; }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: ${theme.breakpoints.lg}) { grid-template-columns: 1fr; }
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: ${theme.breakpoints.lg}) { grid-template-columns: 1fr; }
`;

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectStatistics);
  const isLoading = useAppSelector(selectStatisticsLoading);
  const error = useAppSelector(selectStatisticsError);

  useEffect(() => {
    dispatch(statisticsActions.fetchStatisticsRequest());
  }, [dispatch]);

  return (
    <MainLayout>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
        <PageSubtitle>Overview of your music library</PageSubtitle>
      </PageHeader>

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
                  <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
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
                  <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
                </svg>
              }
            />
          </StatsGrid>

          <ChartsGrid>
            <GenreStatistics data={stats.byGenre} />
            {/* Placeholder for time-series chart */}
            <div style={{
              background: theme.colors.surface,
              borderRadius: theme.radii.lg,
              padding: '20px 24px',
              boxShadow: theme.shadows.card,
            }}>
              <h3 style={{ fontSize: theme.fontSizes.md, fontWeight: 600, marginBottom: 16 }}>
                Songs by Album
              </h3>
              {stats.byAlbum.slice(0, 5).map((a) => (
                <div key={a.album} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span style={{ fontSize: theme.fontSizes.sm, color: theme.colors.textPrimary, fontWeight: 500 }}>{a.album}</span>
                  <span style={{ fontSize: theme.fontSizes.xs, color: theme.colors.textMuted }}>{a.artist} · {a.songCount} songs</span>
                </div>
              ))}
            </div>
          </ChartsGrid>

          <BottomGrid>
            <ArtistStatistics data={stats.topArtists} />
            <AlbumStatistics data={stats.topAlbums} />
          </BottomGrid>
        </>
      )}
    </MainLayout>
  );
};

export default DashboardPage;
