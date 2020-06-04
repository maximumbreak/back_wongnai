/**
 * @typedef Point
 * @param {Point.model} point.body.required - the new point
 * @property {string} reviews reviews - Review Comment - eg: ร้านนี้จะอยู่เส้นสันกำแพง-แม่ออน เลยแยกบ่อสร้างร้านจะอยู่ด้านซ้ายติดริมถนน มีป้ายติดไว้เห็นชัดเจน
 */

/**
 * Get Reviews By ID
 * @route GET /reviews/{id}
 * @group Reviews
 * @param {interger} id.path
 * @returns {object} 200 - Success
 */

/**
 * Get Reviews by Query
 * @route GET /reviews
 * @group Reviews
 * @param {string} query.query.required - query - eg: ต้มยำกุ้ง
 * @returns {object} 200 - Success
 */

/**
 * Update Reviews by ID
 * @route PUT /reviews/{id}
 * @group Reviews
 * @param {interger} id.path
 * @param {Point.model} point.body.required - the new point
 * @returns {object} 200 - Success
 */

exports.foo = function () {}
