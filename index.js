const http = require('http');

const something = `<div class="partial latest-stories" data-module_name="Latest Stories" data-gtm-vis-first-on-screen11864053_516="19230" data-gtm-vis-total-visible-time11864053_516="100" data-gtm-vis-has-fired11864053_516="1">
        <h2 class="latest-stories__heading">Latest Stories</h2>
        <ul>
          <li class="latest-stories__item">
            <a href="/6898406/cinnamon-lead-fda/">
              <h3 class="latest-stories__item-headline">FDA: Some Cinnamon Is Tainted with Lead</h3>
            </a>
              <div class="time-to-read">2 MIN READ</div>
            <time class="latest-stories__item-timestamp">
              March 7, 2024 • 9:06 AM EST
            </time>
          </li>
          <li class="latest-stories__item">
            <a href="/6898396/microplastics-bad-for-heart/">
              <h3 class="latest-stories__item-headline">Study Links Plastic to Worse Heart Health</h3>
            </a>
              <div class="time-to-read">4 MIN READ</div>
            <time class="latest-stories__item-timestamp">
              March 7, 2024 • 9:00 AM EST
            </time>
          </li>
          <li class="latest-stories__item">
            <a href="/6898394/more-black-women-abortion-top-issue-2024-election/">
              <h3 class="latest-stories__item-headline">More Black Women Say Abortion Is Their Top Issue in the 2024 Election</h3>
            </a>
              <div class="time-to-read">3 MIN READ</div>
            <time class="latest-stories__item-timestamp">
              March 7, 2024 • 8:55 AM EST
            </time>
          </li>
          <li class="latest-stories__item">
            <a href="/6898093/kate-middleton-uncle-gary-goldsmith-celebrity-big-brother/">
              <h3 class="latest-stories__item-headline">What to Know About Kate Middleton's Uncle, TV Star Gary Goldsmith</h3>
            </a>
              <div class="time-to-read">4 MIN READ</div>
            <time class="latest-stories__item-timestamp">
              March 7, 2024 • 8:32 AM EST
            </time>
          </li>
          <li class="latest-stories__item">
            <a href="/6883103/the-dread-election/">
              <h3 class="latest-stories__item-headline">The Dread Election </h3>
            </a>
              <div class="time-to-read">9 MIN READ</div>
            <time class="latest-stories__item-timestamp">
              March 7, 2024 • 8:00 AM EST
            </time>
          </li>
          <li class="latest-stories__item">
            <a href="/6694629/abortion-bans-kate-cox-sherri-chessen/">
              <h3 class="latest-stories__item-headline">The Problem With Abortion-Ban Exemptions</h3>
            </a>
              <div class="time-to-read">8 MIN READ</div>
            <time class="latest-stories__item-timestamp">
              March 7, 2024 • 8:00 AM EST
            </time>
          </li>
        </ul>
      </div>`


function removeFormatting(html) {
    let nonFormattedText = html.replace(/(?<!\S)\s+(?!\S)/g, '');

    
    nonFormattedText = nonFormattedText.replace(/[\r\n]+/g, '');
  
    return nonFormattedText;
}
async function getLatestArticles(url) {
    try {
        
        const response = await fetch(url);
        const data = removeFormatting(await response.text());
        const storyheading = '<h3 class="latest-stories__item-headline">'
        const linkheading = '<li class="latest-stories__item"> <a href="'
        const links = [],titles = [];

        let startIdx = data.indexOf(storyheading),endIdx;
        while(startIdx!==-1){
            endIdx = data.indexOf('</h3>', startIdx+1);
            const title = data.substring(startIdx+storyheading.length, endIdx);
            titles.push(title);
            startIdx = data.indexOf(storyheading, endIdx);
        }

        let startIdx2 = data.indexOf(linkheading),endIdx2;
        while(startIdx2!==-1){
            endIdx2 = data.indexOf('">', startIdx2+linkheading.length);
            const link = data.substring(startIdx2+linkheading.length, endIdx2);
            links.push(link);
            startIdx2 = data.indexOf(linkheading, endIdx2);
        }

        const finalResponse = [];
        for(let i=0;i<6;i++){
            finalResponse.push(
                {
                    title: titles[i],
                    link: "https://time.com"+links[i]
                }
            )
        }

        return finalResponse;

    } catch (error) {
        console.log(`Error getting latest articles: ${error}`);
    }
}

const server = http.createServer(async (req, res) => {
    
    try {
        
        const responseData = await getLatestArticles("https://time.com");
        console.log(responseData);
        res.end(JSON.stringify(responseData, null, 2));
    } catch (error) {
        res.end(`Error inside createserver: ${error.message}`);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});
