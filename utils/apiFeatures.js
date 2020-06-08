class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryObj = { ...this.queryString };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|or|regex)\b/g,
      (match) => `$${match}`
    );

    const preFilter = { ...this.query._conditions };
    queryObj = JSON.parse(queryStr);

    let newQueryObj;

    if (queryObj.projectQuery || queryObj.userQuery) {
      if (queryObj.projectQuery) {
        const newQuery = {
          $or: [
            { name: { $regex: `${queryObj.projectQuery}` } },
            { type: { $regex: `${queryObj.projectQuery}` } },
            { description: { $regex: `${queryObj.projectQuery}` } },
          ],
        };

        delete queryObj.projectQuery;

        newQueryObj = {
          $and: [preFilter, newQuery, queryObj],
        };
      }

      if (queryObj.userQuery) {
        const newQuery = {
          $or: [
            {
              name: {
                $regex: new RegExp(queryObj.userQuery.toLowerCase(), 'i'),
              },
            },
            { email: { $regex: `${queryObj.userQuery}` } },
          ],
        };

        newQueryObj = {
          $and: [preFilter, newQuery],
        };
      }
    } else {
      newQueryObj = { ...queryObj };
    }

    this.query = this.query.find(newQueryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt name');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // add -_id to remove id from response
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
