
let chapter_ids    = []
let chapter_titles = []
let chapter_urls   = []

function add_chapter(chapter_id, chapter_title, chapter_url) {
    chapter_ids.push(chapter_id)
    chapter_titles.push(chapter_title)
    chapter_urls.push(chapter_url)
}

function add_chapter(chapter) {
    chapter_ids.push(chapter.id)
    chapters.push(chapter)
}

/**
 * look up the mapping table of chapter id -> chapter title
 * @param {*} chapter_id 
 */
function get_chapter_title(chapter_id) {
    var idx = chapter_ids.indexOf(chapter_id)
    var chapter_title = chapter_titles[idx]
    console.log(`get_chapter_title chapter_id:${chapter_id} idx:${idx} title:${chapter_title}`)
    return chapter_title
}
/**
 * look up the mapping table of chapter id -> chapter file
 * @param {*} chapter_id 
 */
 function get_chapter_url(chapter_id) {
    var idx = chapter_ids.indexOf(chapter_id)
    var chapter_url = chapter_urls[idx]
    console.log(`get_chapter_url chapter_id:${chapter_id} idx:${idx} url:${chapter_url}`)
    return chapter_url
}
/**
 * Show the content of the given chapter id to main content area
 * Update the navigation button state
 * 
 * @param {*} chapter_id is always valid. It is an error to supply invalid cahapter id
 */
function show_chapter(chapter_id) {
    console.log(`show_chapter ${chapter_id}`)
    if (!chapter_id) {
        console.warn(`can not show_chapter ${chapter_id}`)
        return
    }
    const title = get_chapter_title(chapter_id)
    const url   = get_chapter_url(chapter_id)
    console.log(`show chapter ${chapter_id}: [${title}] ${url}`)
    $('#chapter-title').text(title)
    var chapter_next_id = find_chapter_id_next(chapter_id)
    var chapter_prev_id = find_chapter_id_prev(chapter_id)
    $('#chapter-main').load(url)
    $("#chapter-next-button").off()
    if (chapter_next_id)  {
        $("#chapter-next-button").on('click', show_chapter.bind(null, chapter_next_id))
        show_tooltip($("#chapter-next-tooltip-text"), get_chapter_title(chapter_next_id), 'right')
    }
    $("#chapter-prev-button").off()
    if (chapter_prev_id) {
        $("#chapter-prev-button").on('click', show_chapter.bind(null, chapter_prev_id))
        show_tooltip($("#chapter-prev-tooltip-text"), get_chapter_title(chapter_prev_id), 'left')
    }
}



/**
 * Iterate over the keys in a map. The map preserves order.
 * @param {*} chapter_id 
 */
function find_chapter_id_next(chapter_id) {
    var idx = chapter_ids.indexOf(chapter_id)
    if (idx == chapter_ids.size-1) {
        console.warn(`no next chapter for ${chapter_id} idx:${idx}`)
        return
    }
    var next = chapter_ids[idx+1]
    console.log(`find_chapter_id_next chapter_id ${chapter_id}. Returing next ${next}...`)

    return next


}
/**
 * Iterate over the keys in a map. The map preserves order.
 * @param {*} chapter_id 
 */
 function find_chapter_id_prev(chapter_id) {
    var idx = chapter_ids.indexOf(chapter_id)
    if (idx == 0) {
        console.warn(`no previous chapter for ${chapter_id} idx:${idx}`)

        return
    }
    var prev = chapter_ids[idx-1]
    console.log(`find_chapter_id_prev chapter_id ${chapter_id}. Returing prev ${prev}...`)

    return prev

}

function show_tooltip($tooltip, text, css) {
    $tooltip.text('')
    $tooltip.text(text)
    var width = $tooltip.width()

    var twidth = '-' + (width/2).toString() +'.px'
    console.log(`tooltip text ${text} with ${width}`)
    $tooltip.css('position', 'absolute')
    $tooltip.css(css, twidth)
    $tooltip.css('top', '24px')
}

function show_toc($dialog) {
    if ($dialog.children().length == 0) {
        populate_toc_items($dialog)
    }
    $dialog.dialog({
        autoOpen:true, 
        modal:true,
        title: "Chapters"})
}

function populate_toc_items($dialog) {
    var $ul = $('<ul>')
    $dialog.append($ul)
    for (var i = 0; i < chapter_ids.length; i++) {
        var $li = $('<li>')
        $ul.append($li)
        var chapter_id = chapter_ids[i]
        $li.text(chapter_id + ' ' + chapter_titles[i])
        $li.on('click', function() {
            $dialog.dialog('close')
            show_chapter(chapter_id)
            // IMPORTANT
            return false
        })
    }
}


class Chapter {
    constructor() {
        this.id    = data['id']
        this.title = data['title']
        this.url   = data['url']
    }
}

