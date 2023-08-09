// pages/search/index.js
import { getSearchHot, getSearchSuggest,searchSong } from '../../../service/search'

import playStore from '../../../store/player';

import debounce from '../../../utils/debounce';

const debounceGetSearchSuggest = debounce(getSearchSuggest)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue:'',
    hots:[],
    suggestSongs:[],
    suggestSongsNodes:[],
    resultSongs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPageData();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
  },

  getPageData(){
    getSearchHot().then(res=>{
      if(res.code === 200){
        let hots = res.result.hots;
        this.setData({
          hots
        })
      }
    })
  },

  handleSongPlay(e){
    let { id , index } = e.currentTarget.dataset;

    wx.navigateTo({  
      url: '/pages/music_player/music_player?id='+id,  
    })

    playStore.setState('playListIndex',index);
    playStore.setState('playList',this.data.resultSongs);
  },

  // 将关键字映射成两部分nodes
  mapRichNodes(keyword,value){
    let nodes = [];
    // 如果没有匹配上，就显示keyword
    let n2Value = keyword;
    if(keyword.startsWith(value)){
       const n1 = {
         name:'span',
         attrs: { style: "color: #F0908C;font-size:14px" },
         children: [ { type: "text", text:  value } ]
       }
      nodes.push(n1)
      n2Value = keyword.slice(value.length);
    }
    const n2 = {
      name: "span",
      attrs: { style: "color: #424242;font-size:14px" },
      children: [ { type: "text", text: n2Value } ]
    }
    nodes.push(n2);

    return nodes;
  },
  
  changeSearch(event){
    const value = event.detail;
    this.setData({
      searchValue:value
    })

    if(!value){ 
      this.setData({
        suggestSongs:[],
        resultSongs:[]
      })
      debounceGetSearchSuggest.cancel();
      return;
     }

     debounceGetSearchSuggest(value).then(res=>{
      let suggestMatch = res.result.allMatch || [];
      if(res.code==200){
        this.setData({
          suggestSongs:suggestMatch
        })

        const suggestSongsKeywords = suggestMatch.map(item=>item.keyword)
        const suggestSongsNodes = [];
        for (const keyword of suggestSongsKeywords) {
           const nodes = this.mapRichNodes(keyword,value);
           suggestSongsNodes.push(nodes);
        }
        this.setData({
          suggestSongsNodes
        })
      }
    })
  },

  handleKeywordTap(event){
    const keyword = event.currentTarget.dataset.keyword;

    this.setData({
      searchValue:keyword
    })
    this.handleSearchAction();
  },
  handleSearchAction(e){
    const keywords = this.data.searchValue;

    searchSong(keywords).then(res=>{
      if(res.code==200){
        this.setData({
          resultSongs:res.result.songs
        })
      }
    })
  }
})