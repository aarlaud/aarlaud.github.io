const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");

    eleventyConfig.addCollection("article", function(collectionApi) {
        return collectionApi
            .getFilteredByGlob("articles/**/*.md")
            .sort((a, b) => {
                const aTime = DateTime.fromJSDate(a.date).toMillis();
                const bTime = DateTime.fromJSDate(b.date).toMillis();
                if (bTime !== aTime) return bTime - aTime;
                return b.inputPath.localeCompare(a.inputPath);
            });
    });

    eleventyConfig.addFilter("date", (dateObj, format) => {
        const dt = typeof dateObj === "string"
            ? DateTime.fromISO(dateObj)
            : DateTime.fromJSDate(dateObj);
        return dt.toFormat(format || "yyyy-MM-dd");
    });

    eleventyConfig.addFilter("readingTime", (html) => {
        const text = String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        const words = text ? text.split(" ").length : 0;
        return Math.max(1, Math.ceil(words / 200));
    });

    function slugifyHeading(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    eleventyConfig.addFilter("addHeadingIds", (html) => {
        let index = 0;
        return String(html).replace(
            /<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
            (match, level, attrs, inner) => {
                const attrStr = attrs || "";
                if (/\bid\s*=/.test(attrStr)) return match;
                const text = inner.replace(/<[^>]*>/g, "").trim();
                const id = `section-${index++}-${slugifyHeading(text)}`;
                return `<h${level}${attrStr} id="${id}">${inner}</h${level}>`;
            }
        );
    });

    eleventyConfig.addFilter("extractHeadings", (html) => {
        const headings = [];
        const regex = /<h([23])\s[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/gi;
        let match;
        while ((match = regex.exec(String(html))) !== null) {
            headings.push({
                level: parseInt(match[1], 10),
                id: match[2],
                text: match[3].replace(/<[^>]*>/g, "").trim(),
            });
        }
        return headings;
    });
};
