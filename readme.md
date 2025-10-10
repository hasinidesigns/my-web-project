# Rationale

---

## Overview
The aim of this project was to transform my prototype from Assessment 1 into a fully functional web application that showcases materials from the National Film and Sound Archive (NFSA). The goal was to create an engaging and responsive browsing experience that allows users to explore the collection through filters and interactive design. Initially, the project was focused on films, however, after discovering that the film API did not include preview images, I decided to pivot to advertisements instead. This change was important, as the preview images helped in creating an engaging user experience. 

## Design Decisions 
The design of the website was inspired by a minimal and vintage aesthetic.  The landing page uses a short NFSA advertisement clip as a looping background. I added a dark overlay to make the text stand out clearly, while keeping the video visible. On top of the overlay, I included a catchy tagline and an arrow button that takes the user to the main gallery page.  

The gallery page displays the advertisement images in preview cards. I intentionally compressed these images to the same size, to make the scrolling experience more visually pleasing. As the website is scrolling based, I added a “back to the top” arrow that appears as the user scrolls down – this feature greatly helps with navigation and was supported by usability guidelines on intuitive navigation (Nielsen Norman Group, 2023). At the top of the page, there are filter buttons that allow users to sort the advertisements by year, medium, country and colour. These filters can be used individually or combined, giving the users more control over what they view.

Each preview card also includes interactive hover effects that change the card’s colour and reveal the ad’s title and a ‘View Details’ button. Clicking the button opens up a details page that shows the full image, description and extra information about the ad. There is also a link to the advertisement in the NFSA collection, in case the user wants to explore further. I added a small information button at the top right corner of the page, which, when clicked, briefly explains what the website is about, includes links to the NFSA website and gives credit to my university – a footer was intentionally not added due to the scrolling nature of the site. 

## Development Process
I used HTML, CSS and JavaScript to build the web application.  I really focused on maintaining DRY code principles by organising functions, reusing CSS classes and keeping the structure consistent across components. 

The NFSA API was used to fetch advertisement data dynamically, which was then shown on the page. I made sure to use semantic HTML and created a responsive layout using media queries so the site works well on desktop, tablet and mobile screens. I also frequently validated my code using the W3C Markup Validation Service, which helped me fix syntax issues. 


## Challenges and Solutions
Implementing the filters was the most technically challenging part of the project. Utilising multiple filters (such as year, medium, country and colour) to work together required a lot of effort in JavaScript. At first, the filters would overwrite each other, but I then solved this by combining them into a single function that checks all active filters at once before updating the display – examples from Stack Overflow (2025) were very helpful. Another challenge was connecting to the API and making sure the data loaded correctly – this was particularly challenging in the ‘View Details’ section. I used console logging to troubleshoot and made sure the site wouldn't break. 


## Feedback and Iteration
I was unwell during the feedback session in class, but I made sure to talk to my tutor about my progress. His feedback helped me refine my landing page and improve the overall layout, as well as more functional issues with my JavaScript. I also talked to a few friends from the design faculty to review the website and share their thoughts. They suggested small changes, like aligning elements more neatly, and adding hover animations to improve the site. 


## Reflection and Learning
Creating this site has taught me a lot about both design and coding. Before this unit I had no experience using APIs, and I had a very basic understanding of JavaScript. Learning how to fetch data from an external source and display it was challenging but rewarding. I also realised how important certain design details are in improving the user experience – learning to use Bootstrap in combination with custom CSS, allowed me to incorporate many features without wasting time. 

Overall, I’m really proud of how the final website turned out. It feels very cohesive and visually appealing. If I had more time, I would focus on improving accessibility features and adding more detail to the filter options – such as the number of items within each filter.  Overall, this project gave me a far greater understanding of how design and coding work together to build interactive and data rich websites. 


## Use of Generative AI
I acknowledge the use of ChatGPT in supporting my learning and planning process. This included seeking feedback on coding structure and debugging strategies. 


## References
NFSA - Advertisements (2025) Nfsa.gov.au. Available at: https://www.collection.nfsa.gov.au/search/query=advertisements&hasMedia=yes

NFSA. (2025). National Film and Sound Archive API. Available at: https://api.collection.nfsa.gov.au

Nielsen, D. (2019) UX & Usability Articles from Nielsen Norman Group, Nielsen Norman Group. Available at: https://www.nngroup.com/articles/.

OpenAI. (2024). ChatGPT [Large language model]. Available at: https://openai.com/chatgpt

StackOverflow (2025) Newest questions, Stack Overflow. Available at: https://stackoverflow.com/questions.

W3C (n.d) The W3C markup validation service, W3.org. Available at: https://validator.w3.org/.























