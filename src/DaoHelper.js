
export default class DaoHelper{


    /**
     * Provides with a wrapper class to register a DAO in angular.
     * ex: myModule.provider('myDao', DaoHelper.getProvider(MyDAOClass))
     * @param GenericDao
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    static getProvider(dao){
        return class {


            setRootUrl(url){
                this.rootUrl = url;
            }

            /*@ngInject*/
            $get($injector){
                return new dao($injector, this.rootUrl);
            }
        }
    }



}