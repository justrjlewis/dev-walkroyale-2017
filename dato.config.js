const htmlTag = require('html-tag');

const toHtml = (tags) => (
  tags.map(({ tagName, attributes, content }) => (
    htmlTag(tagName, attributes, content)
  )).join("")
);

module.exports = (dato, root, i18n) => {
  ['config.dev.toml', 'config.prod.toml'].forEach(file => {
    root.addToDataFile(file, 'toml', {
      title: dato.site.globalSeo.siteName,
      languageCode: i18n.locale
    });
  });

  root.createDataFile('data/settings.yml', 'yaml', {
    name: dato.site.globalSeo.siteName,
    language: dato.site.locales[0],
    intro: dato.home.introText,
    copyright: dato.home.copyright,
    socialProfiles: dato.socialProfiles.map(profile => {
      return {
        type: profile.profileType.toLowerCase().replace(/ +/, '-'),
        url: profile.url,
      };
    }),
    faviconMetaTags: toHtml(dato.site.faviconMetaTags),
    seoMetaTags: toHtml(dato.home.seoMetaTags)
  });

  root.createPost(`content/about.md`, 'yaml', {
    frontmatter: {
      title: dato.aboutPage.title,
      subtitle: dato.aboutPage.subtitle,
      photo: dato.aboutPage.photo.url({ w: 800, fm: 'jpg' }),
      seoMetaTags: toHtml(dato.aboutPage.seoMetaTags),
      menu: { main: { weight: 100 } }
    },
    content: dato.aboutPage.bio
  });

  root.directory('content/work', dir => {
    dato.works.forEach((work, index) => {
      dir.createPost(`${work.slug}.md`, 'yaml', {
        frontmatter: {
          title: work.title,
          coverImage: work.coverImage.url({ w: 450, fm: 'jpg' }),
          image: work.coverImage.url({ fm: 'jpg' }),
          detailImage: work.coverImage.url({ w: 600, fm: 'jpg' }),
          excerpt: work.excerpt,
          seoMetaTags: toHtml(work.seoMetaTags),
          extraImages: work.gallerySlides.map(item =>
            item.image.url({ h: 300, fm: 'jpg' })
          ),
          weight: index,
        },
        content: work.description
      });
    });
  });
};

