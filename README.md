# Tingyu Lin

Source for [linty5.github.io](https://linty5.github.io/), the personal academic website of Tingyu Lin at TU Wien.

- `_pages/about.md`: homepage and research introduction.
- `_data/news.yml`: news entries.
- `_data/publications.yml`: publication records and resource links.
- `_pages/cv.md`: education, work experience, projects and awards.
- `images/publications/`: publication thumbnails.
- `assets/css/profile.css`: personal-page styles.

To run locally with Ruby and Bundler installed:

```sh
bundle install
bundle exec jekyll serve
```

The site is built with Jekyll for GitHub Pages. Publication lists use YAML data; each thumbnail's `image_version` is the first twelve characters of its SHA-256 checksum.

Based on [AcademicPages](https://github.com/academicpages/academicpages.github.io) and [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes), originally developed by Michael Rose. The theme's MIT copyright notice and license are retained in [LICENSE](LICENSE). Third-party libraries retain their own copyright and license notices.
