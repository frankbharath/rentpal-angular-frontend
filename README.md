## Description
The frontend of the rentpal application is built using Angular 11, Typescript 4.1.2, HTML and CSS. The reason for using the Angular framework is
- Two way binding - even though two binding has impact performace impact, the frontend of the rentpal is not a heavy and complicated. It helped me to write less boiler plate code and implement new features quickly but with an additional performance cost.
- Inbuilt libraries - Angular provides lot of libraries, one such library is HttpClient and it helps to avoid importing 3rd party libraries. The problem with 3rd party library is, it can be deprecated any time if there is no support or funding. 
- Depedency injection - Angular helps to avoid creating services inside constructor, this decouples the components from the services. We can perform unit testing on the component by mocking the service class and also services can be singleton that reduces memory consumption.
