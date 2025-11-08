/**
 * OGP画像のテンプレート
 * Satoriを使ってReact風のJSXでデザインを記述
 */

export function generateOgpTemplate({ title, date, tags, author = 'kyu08' }) {
  // タイトルの長さに応じてフォントサイズを調整
  const getTitleFontSize = (titleLength) => {
    if (titleLength > 50) return '48px';
    if (titleLength > 35) return '56px';
    return '64px';
  };

  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #2d2d44 0%, #1a1a2e 100%)',
        padding: '60px',
        fontFamily: '"Noto Sans JP", sans-serif',
      },
      children: [
        // Header - Blog name in orange box
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              marginBottom: '50px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    background: '#ff9d5c',
                    color: '#1a1a2e',
                    padding: '12px 28px',
                    fontSize: '24px',
                    fontWeight: '700',
                  },
                  children: 'blog.kyu08.com',
                },
              },
            ],
          },
        },
        // Main content - Title
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'flex-start',
              paddingBottom: '20px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: getTitleFontSize(title.length),
                    fontWeight: '700',
                    color: '#ffffff',
                    lineHeight: '1.3',
                    maxHeight: '340px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                  },
                  children: title,
                },
              },
            ],
          },
        },
        // Footer - Meta info
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            },
            children: [
              // Author and date
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '24px',
                          color: '#ff9d5c',
                          fontWeight: '700',
                        },
                        children: `@${author}`,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '24px',
                          color: '#a0a0b0',
                        },
                        children: date,
                      },
                    },
                  ],
                },
              },
              // Tags
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                  },
                  children: tags.map((tag) => ({
                    type: 'div',
                    props: {
                      style: {
                        padding: '8px 20px',
                        background: 'rgba(255, 157, 92, 0.15)',
                        border: '2px solid #ff9d5c',
                        borderRadius: '8px',
                        fontSize: '18px',
                        color: '#ff9d5c',
                        fontWeight: '500',
                      },
                      children: `#${tag}`,
                    },
                  })),
                },
              },
            ],
          },
        },
      ],
    },
  };
}
