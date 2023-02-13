import { Group, Pagination, SimpleGrid, SimpleGridProps, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { Asset } from '../src/types/assets';
import { Game } from '../src/types/games';
import Filters from './Filters';
import GameCard from './GameCard';

interface GameGridProps extends Omit<SimpleGridProps, 'cols' | 'spacing' | 'breakpoints'> {
  assets: Map<string, Partial<Asset>>;
  totalPages: number;
  games: Game[];
  page: number;
}

export default function ({ page, games, totalPages, assets, ...props }: GameGridProps) {
  const breakpoint = useMediaQuery('(min-width: 1200px)') ?? true;
  const [filteredGames, setGames] = useState(games);
  const [filtered, setFiltered] = useState(false);
  const router = useRouter();

  return (
    <Stack align="center" mt={50} mb={20}>
      <Group noWrap>
        <Filters games={filteredGames} page={page} initialGames={games} setFiltered={setFiltered} setGames={setGames} />
      </Group>
      <SimpleGrid
        spacing="xl"
        cols={4}
        breakpoints={[
          { cols: 2, maxWidth: 1335 },
          { cols: 1, maxWidth: 715 },
        ]}
        {...props}
      >
        {filteredGames.map((game) => {
          const { slug } = game;
          return <GameCard key={slug} game={game} banner={assets.get(slug).banner} />;
        })}
      </SimpleGrid>
      {!filtered && (
        <Pagination
          radius="md"
          page={page}
          total={totalPages}
          size={breakpoint ? 'lg' : undefined}
          onChange={(value) => router.push(`/page/${value}`)}
        />
      )}
    </Stack>
  );
}