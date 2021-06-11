# Onboard

## To Run Project:

To get your project up and running in your local computer, follow the below steps:

### Clone Project

```
git clone https://github.com/cse110-sp21-group34/cse110-sp21-group34.git
```

This will download the code and files in our repo to your local computer.  
The size is very large solely due to the Status Video and CI Pipeline Video.

### Install Dependencies

Go into the repo's folder in your local computer in a terminal of your choice.

```
cd source
npm install
```

This installs all the dependencies required by the project to successfully run. As `source` is where all the code lies in, we have made it mandatory to go inside it before installing dependencies.  
This process can take a surprisingly long amount of time, sometimes. In our experience, it has taken from 2 minutes to 10 minutes for the final version of our project. Please wait patiently until the dependencies get installed.


### Build The Project

```
npm run dev
```

This builds the project using `parcel` and this process can take from 10 seconds to 2 minutes. Please wait patiently until the process is finished when the terminal will indicate that the 

```
Server running at http://localhost:8000
```

### Run the project in your browser

After getting the above notification, navigate to the following link in a browser of your choice:

```
http://localhost:8000
```

[Clickable Link](http://localhost:8000)

The project is now ready to be fiddled around with in your own browser!

To view the different features, head over to our [**Feature List**](./features/feature-list.md).

## To Test the Build Pipeline in Github Actions:

This process is incredibly simple. After committing your changes locally, push the commits to the repo.  

1. Navigate to [Github Actions](https://github.com/cse110-sp21-group34/cse110-sp21-group34/actions) to view the Actions that are being run for the commits.
2. Navigate to either of two actions that are being run to view their progress.
   1. Unit Tests and E2E Test
   2. Automated JSDoc Generation
3. If any of jobs had failed, you can take a look at the error trace to track the problem.