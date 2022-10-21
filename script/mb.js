/**
 * Design:
 *   The model classes are: Repository , Section and Chapter
 *    
 *   1. The functions in the script renders the model classes on HTML element
 *   using JQuery library. The HTML elements are referred by their ids.
 *   2. Each chapter specifies its content as URL. That URL is loaded dynamically 
 *   on to a HTML element.
 *   3. The navigation buttons are populated with the next and previous chapter in
 *      the repository. Hence the chapters are ordered
 *   4. The table of content is dynamically generated from the repo.
 *   5. The chapter is parsed for tokens to be used in Glossary. The glossary terms
 *      are rendered using a template
 */

/**
  * Repository is the cotainer of all sections and chapters.
  * The chapters are ordered.
  * 
 */
class Repository {
    constructor() {
        console.debug(`creating empty content Repository...`)
        this.chapters       = []
        this.sections       = []  
    }

    debug() {
        for (var i = 0; i < this.sections.length; i++) {
            console.debug(`${this.sections[i].title}`)
        }
        for (var i = 0; i < this.chapters.length; i++) {
            var chapter = this.chapters[i]
            console.debug(`${chapter.idx} ${chapter.label} ${chapter.title}`)
        }
    }
    /**
     * Find the chapter with given index.
     * If given idx is out of bounds, get the first chapter  
     * @param {int} idx 0-based serial index of the chapters
     * @returns a chapter or the 0-th chapter
     */
    find_chapter_by_id(idx) {
        try {
            return this.chapters[idx]
        } catch (err) {
            console.warn(`no chapter at index ${idx}. Returning the first chapter`)
            return this.chapters[0]
        }
    }
}

// **********************************************************************
class Chapter {
    /**
     * creates a chapter. The index is not assigned at construction.
     * It is added when chapter is added 
     * @param {object} data 
     */
    constructor(data) {
        this.idx   = -1
        this.label = data['label']
        this.title = data['title']
        this.src   = data['src']
        this.url   = ''
    }
}
// **********************************************************************
class Section {
    /**
     * creates a section. The index is not assigned at construction.
     * It is added when section is added 
     * @param {object} data 
     */
    constructor(data) {
        this.idx   = -1
        this.label = data['label']
        this.title = data['title']
        this.root  = data['root']
        this.src   = data['src']
        this.chapters = []
    }
}
// ************************************************************************
class Mahabharath {
    constructor() {
        console.debug(`creating Mahabharatha...`)
        this.options = {
            logo: 'mb-logo.jpeg',
            root : {content: 'content/chapter', 
                   glossary: 'content/glossary',
                   images: '../../images' }
        }
        this.repo = new Repository()
    }
    /**
     * The last shown chapter index is stored in local storage.
     * @returns last shown chapter
     */
    read_current_chapter_from_local_storage = function() {
        var idx = window.localStorage.getItem('chapter-idx') || 0
        return this.repo.find_chapter_by_id(idx)
    }

    
    /**
     * Creates and adds a new section. 
     * All sections are maintained by the repo.
     * A section id is assigned and section url 
     * The input section root is relative to the content root directory.
     * The section root is appended to the root content directory to create an URL 
     * The chapters will be added to the section later.
     * @param {Section} section 
     * 
     * @return the new section added
     */
    new_section(data) {
        var section = new Section(data)
        section.idx = this.repo.sections.length
        section.label = roman_numeral(section.idx+1)
        section.root = this.options.root.content + '/' + section.root
        section.url  = `${section.root}/${section.src}`
        console.debug(`new_section ${section.label}  [${section.title}] ${section.root}`)
        this.repo.sections.push(section)
        return section
    }
    /**
     * adds the chapter. All chapters are maintained by the repo.
     * The chapters are added to the repo in order.
     * @param {Chapter} chapter 
     */
    add_chapter(section, chapter) {
        chapter.section = section
        chapter.url = `${section.root}/${chapter.src}`

        section.chapters.push(chapter)
        chapter.idx = this.repo.chapters.length
        chapter.label = `${section.label}.${roman_numeral(section.chapters.length)}`
        chapter.url = `${section.root}/${chapter.src}`
        console.debug(`add_chapter ${chapter.idx} [${chapter.label} ${chapter.title}] ${chapter.url}`)
        this.repo.chapters.push(chapter)
    }
    /**
     * adds the chapter. The chapter url is the section.root prepended with chapter source
     * @param {Chapter} chapter 
     */
    show_chapter = function (chapter) {
        if (!chapter) {
            console.warn(`can not show undefined chapter`)
            return
        } 
        console.debug(`show chapter ${chapter.toString()}`)
        $('#section-title').text(chapter.section.title)
        $('#chapter-title').text(chapter.title)
        $('#breadcrumbs').text(`${chapter.section.title}/${chapter.title}`)
        $('#status').text(chapter.title)
        // the action handlers are set after the content is loaded into the view
        var ctx = this
        $('#chapter-main').load(chapter.url, function() {
            $(".glossary-term").on("click", function() {
                var href  = $(this).attr('href')
                var title = $(this).text()
                ctx.show_glossary(title, href)
            })
        })
        $(".chapter-next-button").off('click')
        $(".chapter-next-button").on('click', function() {
            console.debug(`next button clicked. current chapter ${chapter.idx} [${chapter.label}]`)
            var next = ctx.repo.find_chapter_by_id(chapter.idx+1)
            console.debug(`next chapter ${next.idx} [${next.label}]`)
            ctx.show_chapter(next)
            ctx.show_status($(this), next.title, chapter.title)
            return false // IMPORTANT 
        })
        
        $(".chapter-prev-button").off('click')
        $(".chapter-prev-button").on('click', function() {
            var prev = ctx.repo.find_chapter_by_id(chapter.idx-1)
            ctx.show_chapter(prev)
            ctx.show_status($(this), prev.title, chapter.title)
            return false // IMPORTANT 

        })
    }

    show_status = function($button, text1, text2) {
        var $status = $('#status')
        $button.hover(function() {
            $status.text(text1)
        }, function() {
            $status.text(text2)
        })
    }

    show_glossary = function(title, href) {
        console.log(`glossary-term [${title}] clicked. show ${href}`)
        $('#glossary-popup').load(this.options.glossary_dir+'/'+href, function(){
            $(this).dialog({modal:false,
                title: title,
                autoOpen: true})
        })
    }

    /**
     * Renders titles of all sections and their chapters to the given element
     * as a list.
     * Each title when clicked will display the content. 
     * 
     * Do nothing if the given div element is already populated
     * 
     * @see #populate_toc_items
     * 
     * @param {jQuery} $div 
     */
    show_toc = function($div) {
        if ($div.children().length == 0) {
            console.debug(`show_toc ${this.repo.sections.length} sections`)
            
            var $ul = $('<ul>')
            $ul.css('padding', '0')
            $ul.css('list-style-type', 'none')
            
            $div.append($ul)
            console.debug(`populate_toc_items ${this.repo.sections.length} sections`)
            for (var i = 0; i < this.repo.sections.length; i++) {
                var $li = this.populate_section($div, this.repo.sections[i])
                $ul.append($li)
            }
        }
    }
    /**
     * Create a section
     * @param {jQuery} $div
     * @param {Section} section 
     */
    populate_section = function($div, section) {
        console.debug(`populate_section ${section.title} ${section.chapters.length} chapetrs`)

        var $item = $('<li>')
        $item.css('white-space', 'nowrap')
        $item.addClass('w3-text-yellow')
        $div.append($item)
        $item.text(section.title)

        var $ul = $('<ul>')
        $ul.css('list-style-type', 'none')
        $ul.css('overflow', 'hidden')
        $ul.css('text-overflow', 'ellipsis')
        $ul.addClass('w3-text-white w3-small')

        $item.append($ul)
        for (var i =0; i < section.chapters.length; i++) {
            var chapter = section.chapters[i]
            var $li = $('<li>')
            $ul.append($li)
            $li.text(chapter.label + ' ' + chapter.title)
            $li.on('click', function() {
                // IMPORTANT
                return false
            })
            $li.on('click', this.show_chapter.bind(this, chapter))
        }
        return $item
    }
}
const ROMAN_NUMERALS = [undefined,
                        'i', 'ii', 'iii', 'iv', 'iv', 'v',
                        'vi', 'vii', 'viii', 'ix', 'x',
                        'xi', 'xii', 'xiii', 'xiv', 'xv',
                        'xvi', 'xvii', 'xviii', 'xix', 'xx']
function roman_numeral(num) {
        return ROMAN_NUMERALS[num]
}

Chapter.prototype.toString = function () {
    return `${this.idx} [${this.section.title}] [${this.title}] ${this.url}`
}
Section.prototype.toString = function () {
    return `${this.idx} [${this.title}] ${this.url}`
}



