import { ImageResponse } from 'next/og';
import { getSpeciesBySlug, specimenNumber } from '@/lib/species';
import { CATEGORY_BY_KEY, DANGER_BY_LEVEL } from '@/data/taxonomy';

export const runtime = 'edge';

const DANGER_COLOR: Record<number, string> = {
  0: '#4C9A6A',
  1: '#D0912B',
  2: '#B8302A',
};

const BG = 'linear-gradient(135deg, #0B1A15 0%, #0F2119 58%, #122A21 100%)';

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') ?? '';
  const species = getSpeciesBySlug(slug);

  if (!species) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            background: BG,
            color: '#F4EEDD',
            fontSize: 64,
          }}
        >
          KoïKoSamui
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }

  const cat = CATEGORY_BY_KEY[species.category];
  const danger = DANGER_BY_LEVEL[species.danger];
  const color = DANGER_COLOR[species.danger] ?? '#C9A227';
  const no = String(specimenNumber(species.slug)).padStart(3, '0');

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '64px 72px',
          background: BG,
          color: '#F4EEDD',
          fontFamily: 'sans-serif',
        }}
      >
        {/* barre supérieure : wordmark + n° spécimen */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 24,
            letterSpacing: 4,
            color: '#A9B5AC',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 999,
                border: '3px solid #0B1A15',
                background:
                  'linear-gradient(to bottom, #C9A227 0%, #C9A227 50%, #F4EEDD 50%, #DBD3BC 100%)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 16,
                  height: 4,
                  background: '#0B1A15',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  width: 13,
                  height: 13,
                  borderRadius: 999,
                  background: '#F4EEDD',
                  border: '3px solid #0B1A15',
                }}
              />
            </div>
            <span style={{ color: '#F4EEDD' }}>
              KOÏKO<span style={{ color: '#C9A227' }}>SAMUI</span>
            </span>
          </div>
          <span>SPÉCIMEN N° {no}</span>
        </div>

        {/* corps : catégorie + nom commun + nom latin */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: '#17A398',
              marginBottom: 10,
            }}
          >
            {cat.label}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 86,
              fontWeight: 700,
              lineHeight: 1.02,
            }}
          >
            {species.commonName}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 40,
              color: '#C9A227',
              marginTop: 8,
            }}
          >
            {species.latinName}
          </div>
        </div>

        {/* pied : badge dangerosité */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 24px',
              borderRadius: 999,
              border: `2px solid ${color}`,
              color,
              fontSize: 26,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: color,
              }}
            />
            {danger.label}
          </div>
          <span style={{ display: 'flex', fontSize: 24, color: '#A9B5AC' }}>
            Bestiaire du Golfe de Thaïlande
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
