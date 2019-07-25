# Red Balloon Hiring Project

N.B. this isn't fully live yet, we're just waiting on DNS propagation

This is a tiny website I was commissioned to build for Helix Nanotechnologies to help them hire an immunotherapy scientist for leading the development of new cancer therapies. It's based on the [Red Balloon Challenge](https://cacm.acm.org/magazines/2011/4/106587-reflecting-on-the-darpa-red-balloon-challenge/fulltext), an experiment in applying social networks to solve distributed problems using financial incentives. $2000 is given to the successful candidate, $1000 to the person who invited them to apply, $500 to whoever invited the inviter, and so on.

For this project I decided to try building a fully serverless backend for the first time. It uses Netlify for the frontend hosting, Netlify Functions for receiving the signups and applications, FaunaDB for storing the referrals, and Mailgun to deliver the uploaded CVs. The free tier of each is sufficient for this use case, which is pretty neat! In theory, a system built like this can run indefinitely for as long as the underlying services remain intact and compatible.
