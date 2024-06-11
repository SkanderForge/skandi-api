import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

import router from '@adonisjs/core/services/router'
import fs from 'node:fs'
const UtilitiesController = () => import('#controllers/utilities_controller')
const AdminController = () => import('#controllers/admin_controller')
const SavesController = () => import('#controllers/saves_controller')

router.post('/utilities/parseClausewitz', [UtilitiesController, 'clausewitzToJson'])
router.post('/utilities/bmpToGeoJson', [UtilitiesController, 'bmpToGeoJson'])
router.post('/admin/addDataset', [AdminController, 'addDataset'])
router.post('/saves/', [SavesController, 'uploadNewSave'])
router
  .get('/saves/:key/:field', [SavesController, 'getSavefileField'])
  .where('field', { match: /^provincesData$|^countriesData$|^metaData$|^game$/ })
//router.get('/saves/:id/map', [SavesController, 'getSaveFileMap'])

router
  .get('/saves/:key/:datafile', [SavesController, 'getSavefileDatafile'])
  .where('datafile', { match: /^mapData$/ })

router.get('/swagger', async () => {
  return fs.readFileSync('./swagger.yml', 'utf8')
  //return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
  // return AutoSwagger.default.scalar("/swagger", swagger); to use Scalar instead
  // return AutoSwagger.default.rapidoc("/swagger", swagger); to use RapiDoc instead
})
