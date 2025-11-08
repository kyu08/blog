/**
 * OGP画像のテンプレート
 * Satoriを使ってReact風のJSXでデザインを記述
 */

export function generateOgpTemplate({ title, date, tags, author = 'kyu08' }) {
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
        // Header - Blog name
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#ff9d5c',
                    marginRight: '12px',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '24px',
                    color: '#e0e0e0',
                    fontWeight: '400',
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
              justifyContent: 'center',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '56px',
                    fontWeight: '700',
                    color: '#ffffff',
                    lineHeight: '1.3',
                    marginBottom: '30px',
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
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            },
            children: [
              // Left side - Author and date
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '20px',
                          color: '#ff9d5c',
                          fontWeight: '500',
                        },
                        children: `@${author}`,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '18px',
                          color: '#a0a0b0',
                        },
                        children: date,
                      },
                    },
                  ],
                },
              },
              // Right side - Tags
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                  },
                  children: tags.map((tag) => ({
                    type: 'div',
                    props: {
                      style: {
                        padding: '8px 16px',
                        background: 'rgba(255, 157, 92, 0.15)',
                        border: '2px solid #ff9d5c',
                        borderRadius: '8px',
                        fontSize: '16px',
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
