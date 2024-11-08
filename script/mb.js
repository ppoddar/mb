class Repository{
    constructor(options){
        this.options = options
        this.root = options['root']
        this.parvas= []
    }
    add_parva(data) {
        var parva = new Parva(data)
        parva.index = this.parvas.length;
        parva.label = roman_numeral[parva.index]
        parva.url   = this.root + '/'+ parva.root 
        this.parvas.push(parva)

        return parva
    }

    find_parva_by_id(idx){
        if (idx <0 || idx >= this.parvas.length) return this.parvas[0] 
        else return this.parvas[idx]
    }

    find_chapter(idx1, idx2) {
        return this.find_parva_by_id(idx1).find_chapter_by_id(idx2)
    }

    next_chapter(chapter) {
        var idx1 = chapter.parva.index
        var idx2 = chapter.index+1
        if (chapter.index+1>=chapter.parva.chapters.length) {
            idx1 = chapter.parva.index+1
            idx2 = 0
        }
        return this.find_chapter(idx1, idx2)
    }

    
}
class Parva{
    constructor(data){
        this.title = data['title']
        this.root  = data['root']

        this.chapters = []
    }
    add_chapter(data) {
        var chapter = new Chapter(data)
        chapter.index = this.chapters.length
        chapter.label = this.label + '.' + roman_numeral[chapter.index]
        chapter.parva = this
        this.chapters.push(chapter)
        chapter.url = this.url + '/'+ chapter.src 
    }
    find_chapter_by_id(idx){
        if (idx <0 || idx >= this.chapters.length) return this.chapters[0]
        else return this.chapters[idx] 
    }

}
class Chapter{
    constructor(data){
        this.title = data['title']
        this.src   = data['src']
    }
}

const roman_numeral = ["I","II","III", "IV", "V", "VI","VII","VIII","IX","X","XI","XII"]

class Mahabharatha{
    constructor(){
        this.repo = new Repository({root:'content'})
        var adi  = this.repo.add_parva({title:'Adi Parva', root: 'adi'})
        var vana = this.repo.add_parva({title:'Vana Parva', root: 'vana'})
        adi.add_chapter({title:'The Kuru clan',     src:'00_kuru_clan.html'})
        adi.add_chapter({title:'Banished from the heaven',     src:'01_banished_from_heaven.html'})
        adi.add_chapter({title:'Ganga makes a pact',     src:'02_ganga_makes_a_pact.html'})
        adi.add_chapter({title:'Babies floated in river',     src:'03_babies_floated in_river.html'})
        adi.add_chapter({title:'The lost son returns',     src:'05_lost_son_returns.html'})
        adi.add_chapter({title:'A marriage proposal',     src:'06_marriage_prposal.html'})
        adi.add_chapter({title:'Visma elopes the brides',     src:'00_kuru_clan.html'})
        adi.add_chapter({title:'Surrogate birth',     src:'00_kuru_clan.html'})
        adi.add_chapter({title:'Vyas comes to rescue',     src:'00_kuru_clan.html'})
        adi.add_chapter({title:'The birth of kurus',     src:'00_kuru_clan.html'})
        adi.add_chapter({title:'The death of Pandu',     src:'00_kuru_clan.html'})
        vana.add_chapter({title:'Moy builds palace',src:'00-moy-builds-palace.html' })
    }
}