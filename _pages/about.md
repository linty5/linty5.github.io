---
layout: profile
permalink: /
title: "Tingyu LIN"
excerpt: "Tingyu Lin is a PhD candidate at TU Wien, working on video analysis and understanding."
author_profile: false
body_class: profile-site
redirect_from:
  - /about/
  - /about.html
---

<section class="profile-intro" aria-labelledby="profile-name">
  <div class="profile-bio">
    <h1 id="profile-name">Tingyu LIN <span lang="zh">林莛庾</span></h1>
    <p>I am a PhD candidate at the <a href="https://cvl.tuwien.ac.at/">Computer Vision Lab</a>, <a href="https://www.tuwien.at/en/">TU Wien</a>, working within the <a href="https://visual-heritage.fhstp.ac.at/">Visual Heritage</a> doctoral programme under the supervision of <a href="https://cvl.tuwien.ac.at/staff/robert-sablatnig/">Prof. Robert Sablatnig</a> and <a href="https://icmt.fhstp.ac.at/en/team/wolfgang-aigner">Prof. Wolfgang Aigner</a>. My research focuses on video analysis and understanding, with an emphasis on camera setting analysis. I also explore how computer vision and expert knowledge can be combined to support the analysis and interpretation of historical visual heritage.</p>
    <nav class="profile-links" aria-label="Contact and academic profiles">
      <a href="mailto:tingyu.lin@tuwien.ac.at"><i class="fas fa-fw fa-envelope" aria-hidden="true"></i> Email</a>
      <a href="https://scholar.google.com/citations?user=QyVVPMoAAAAJ"><i class="fas fa-fw fa-graduation-cap" aria-hidden="true"></i> Google Scholar</a>
      <a href="https://github.com/linty5"><i class="fab fa-fw fa-github" aria-hidden="true"></i> GitHub</a>
      <a href="{{ '/cv/' | relative_url }}"><i class="fas fa-fw fa-file-alt" aria-hidden="true"></i> CV</a>
    </nav>
  </div>
  <figure class="profile-portrait">
    <img src="{{ '/images/tingyu_lin.png' | relative_url }}" width="190" height="190" alt="Tingyu Lin" fetchpriority="high">
  </figure>
</section>

<section class="profile-section profile-news" aria-labelledby="news-heading">
  <h2 id="news-heading">News</h2>
  <ul class="news-list">
    {% for item in site.data.news %}
    <li><time datetime="{{ item.date }}">{{ item.date }}</time><span>{{ item.text }}</span></li>
    {% endfor %}
  </ul>
</section>

<section class="profile-section" aria-labelledby="publications-heading">
  <div class="profile-section-heading">
    <h2 id="publications-heading">Selected Publications</h2>
    <a class="section-link" href="https://scholar.google.com/citations?user=QyVVPMoAAAAJ">Google Scholar ↗</a>
  </div>
  {% include publication-list.html kind="paper" selected=true %}
</section>
