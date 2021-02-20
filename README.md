## Description
The frontend of the rentpal application is built using Angular 11, Typescript 4.1.2, HTML and CSS. The reason for using the Angular framework are
- Two way binding - even though two binding has impact performace impact, the frontend of the rentpal is not a heavy and complicated. It helped me to write less boiler plate code and implement new features quickly but with an additional performance cost.
- Inbuilt libraries - Angular provides lot of libraries e.g, HttpClient and it helps to avoid importing 3rd party libraries. The problem with 3rd party library is, it can be deprecated any time if there is no support or funding. 
- Depedency injection - Angular helps to avoid creating services inside constructor, this decouples the components from the services. We can perform unit testing on the component by mocking the service class, also services are singleton and reduces memory consumption.

## Concept learnt and used
- RxJS - All the asynchronous operation in Angular are observables where we can subscribe and listen for new values. The advantages of observables comes with operators, we can manipulate input stream using filter, map or even to have some common errors being caught using catchError(used in HttpClient in interceptor) before calling the subscribed method. There are other operators such as debounce(will not emit value based on given time) and switchMap(cancelling previous observable) that helps to avoid requesting API server frequently.  
- Material - I have the developed the UI extensively using Material and helped me to focus on the business logic.
- Components - Learnt component lifecycle, its hook and also to invoke the hook based on given scenerio eg., accessing the child component in ngAfterViewInit. It is also important for me learn component re-renderding and how it works. Learnt the differences between default and onPush startegy. Creating immutable objects avoids re-rendering of child component, if the parent component sends an object to child component.
- Routes - I have used routes to navigate to different tabs, used route resolver to load data before showing the component and also route guard to verify if the route can be accessed or not.
- Depedency Injection - Created singleton services and used DI to inject service class to component class. 

## Build
Prerequisite - Node v14.15.1, Angular 11, Typescript 4.1.2
- Production - ng build --prod 
- Development - ng build

## Screenshots 
![Screenshot 2021-02-20 200030](https://user-images.githubusercontent.com/49817583/108605774-a38b7580-73b6-11eb-8720-76c5853e24ac.png)
![Screenshot 2021-02-20 200117](https://user-images.githubusercontent.com/49817583/108605775-a4240c00-73b6-11eb-8ebb-3f2085b57856.png)
![Screenshot 2021-02-20 200149](https://user-images.githubusercontent.com/49817583/108605776-a4240c00-73b6-11eb-9e46-488ef265a1be.png)
![Screenshot 2021-02-20 200216](https://user-images.githubusercontent.com/49817583/108605778-a4bca280-73b6-11eb-8a79-25034c770a96.png)
