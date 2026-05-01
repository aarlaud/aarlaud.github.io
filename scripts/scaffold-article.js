#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");

// Get article title from command line arguments
const title = process.argv[2];

if (!title) {
  console.error(`Usage: npm run new-article "Your Article Title"`);
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)+/g, "");
const date = DateTime.now().toFormat("yyyy-MM-dd");
const filePath = path.join(__dirname, `../articles/${slug}.md`);

if (fs.existsSync(filePath)) {
  console.error(`Error: Article already exists at ${filePath}`);
  process.exit(1);
}

const template = `---
layout: _layouts/article.njk
title: ${title}
date: ${date}
summary: A short 2-3 sentence summary of what this article covers.
tags: [webdev]
permalink: /articles/${slug}/
---

![Article Header Image](/assets/images/placeholder.svg)

## Introduction

Start your story here. What inspired this post or what problem are you solving?

## The Core Concept

Break down the main ideas step-by-step. Use headers and lists to keep the post readable.

## Key Takeaways

- What should the reader remember most?
- What are the actionable insights?
- Any final thoughts?

## Conclusion

End with a strong summary or a call to action.
`;

fs.writeFileSync(filePath, template);
console.log(`✅ New article created: ${filePath}`);
