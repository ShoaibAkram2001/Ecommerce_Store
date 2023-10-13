class apiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    console.log("Before apply regex express..", this.queryStr.keyword);
    const Keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    console.log(Keyword);
    console.log(this.query);

    this.query = this.query.find({ ...Keyword });

    return this;
  }

  filter() {
    const copiedQuery = { ...this.queryStr };
    console.log("CopiedQuery:", copiedQuery);

    // Removing some fields for category
    const removeQueryFields = ["keyword", "page", "limit"];

    removeQueryFields.forEach((field) => delete copiedQuery[field]);

    console.log("After remove fields:", copiedQuery);

    this.query = this.query.find(copiedQuery);

    //Filter for price and rating
    /*
    let updateCopiedQuery= JSON.stringify(copiedQuery);
     console.log(updateCopiedQuery);

    updateCopiedQuery=updateCopiedQuery.replace('/\b(gt|gte|lt|lte)\b/g',(key)=>`$${key}` );

 
       console.log(updateCopiedQuery);
    this.query=this.query.find(JSON.parse(updateCopiedQuery));

     */

    return this;
  }


  pagination(ResultPerPage){

    console.log(ResultPerPage);
    const currentPage=Number(this.queryStr.page)||1;
    const skip=ResultPerPage*(currentPage-1);

    this.query=this.query.limit(ResultPerPage).skip(skip);

    return this;
  }
}

module.exports = apiFeatures;
