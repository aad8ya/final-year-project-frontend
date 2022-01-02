import axios from 'axios'

export const loadFonts = async (sort) => {
    let url = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBaX8tNR8l6g596VD30jXrb8sqcIay1OQg'
    url = `${url}&sort=${sort}`
    let res = await axios.get(url)
    return res.data.items
}
