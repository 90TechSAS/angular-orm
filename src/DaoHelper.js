import ServiceLocator from './ServiceLocator'

export default class DaoHelper{


    /**
     * Provides with a wrapper class to register a DAO in angular.
     * ex: myModule.provider('myDao', DaoHelper.getProvider(MyDAOClass))
     * @param GenericDao
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    static getProvider(dao){
        let sl      = ServiceLocator.instance;

        return class {

            constructor(){
               this.dao = new dao();
                sl.registerDao(this.dao.getModel().getName(), this.dao)
            }


            setRootUrl(url){
                this.dao.url = url;
            }

            setDiscriminatorUrl(type, url) {
              _.each(this.dao.discriminators, (discriminator) => {
                if (discriminator.type === type) {
                  discriminator.discriminatorUrl = url
                }
              })
            }

            $get(){
                return this.dao;
            }
        }
    }


    static registerService(module, name, dao){
        module
            .provider(name, DaoHelper.getProvider(dao))
            .run([name, '$injector', function(service, $injector){
                ServiceLocator.instance.registerInjector($injector)
                //service.setInjector($injector);
            }])
    }



}