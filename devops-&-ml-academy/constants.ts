import { Chapter } from './types';

export const CURRICULUM: Chapter[] = [
  {
    id: 'ch2',
    number: 2,
    title: 'GitHub Actions',
    description: 'Explore the diverse components of GHA, encompassing events, actions, jobs, steps, runners, and context.',
    topics: [
      { id: '2-1', title: 'Intermediate YAML', xp: 50 },
      { id: '2-2', title: 'Find the correct combination', xp: 50 },
      { id: '2-3', title: 'Design a Continuous Integration workflow', xp: 100 },
      { id: '2-4', title: 'Setting a basic CI pipeline', xp: 50 },
      { id: '2-5', title: 'Interpret GitHub Actions Workflow', xp: 100 },
      { id: '2-6', title: 'Write a GitHub Actions Workflow', xp: 100 },
      { id: '2-7', title: 'Running repository code', xp: 50 },
      { id: '2-8', title: 'Feature branches in shared repository model', xp: 50 },
      { id: '2-9', title: 'Running Python code in GitHub Actions', xp: 100 },
      { id: '2-10', title: 'Environment Variables and Secrets', xp: 50 },
      { id: '2-11', title: 'What is GITHUB_TOKEN?', xp: 50 },
      { id: '2-12', title: 'Working with environment variables', xp: 100 },
      { id: '2-13', title: 'Working with secrets', xp: 100 },
    ]
  },
  {
    id: 'ch3',
    number: 3,
    title: 'Continuous Integration in Machine Learning',
    description: 'Integrate machine learning model training into a GitHub Action pipeline using Continuous Machine Learning (CML) and DVC.',
    topics: [
      { id: '3-1', title: 'Model training with GitHub Actions', xp: 50 },
      { id: '3-2', title: 'Develop a classification model', xp: 100 },
      { id: '3-3', title: 'Train a classification model', xp: 100 },
      { id: '3-4', title: 'Setup model training using CML', xp: 100 },
      { id: '3-5', title: 'Versioning datasets with Data Version Control', xp: 50 },
      { id: '3-6', title: 'Why are .dvc files needed?', xp: 50 },
      { id: '3-7', title: 'Data versioning in action', xp: 100 },
      { id: '3-8', title: 'Interacting with DVC remotes', xp: 50 },
      { id: '3-9', title: 'Exploring the Benefits of DVC Remotes', xp: 50 },
      { id: '3-10', title: 'DVC remotes in action', xp: 100 },
      { id: '3-11', title: 'DVC Pipelines', xp: 50 },
      { id: '3-12', title: 'Creating a DVC pipeline', xp: 100 },
      { id: '3-13', title: 'Train ML models with DVC', xp: 100 },
    ]
  },
  {
    id: 'ch4',
    number: 4,
    title: 'Comparing training runs and Hyperparameter (HP) tuning',
    description: 'Analyze model performance, fine-tune hyperparameters, and automate pull requests using the optimal model configuration.',
    topics: [
      { id: '4-1', title: 'Comparing metrics and plots in DVC', xp: 50 },
      { id: '4-2', title: 'Adding metrics and plots to dvc.yaml', xp: 100 },
      { id: '4-3', title: 'Comparing metrics across Git branches', xp: 100 },
      { id: '4-4', title: 'Run DVC pipeline in GitHub Actions', xp: 100 },
      { id: '4-5', title: 'Hyperparameter Tuning with DVC', xp: 50 },
      { id: '4-6', title: 'Adding Hyperparameter tuning to dvc.yaml', xp: 100 },
      { id: '4-7', title: 'Running Hyperparameter tuning DVC pipelines', xp: 100 },
      { id: '4-8', title: 'GitHub Actions workflow for Hyperparameter Tuning', xp: 50 },
      { id: '4-9', title: 'Loose Coupling', xp: 50 },
      { id: '4-10', title: 'Setup Hyperparameter Tuning in GitHub Actions', xp: 100 },
      { id: '4-11', title: 'Congratulations!', xp: 50 },
    ]
  }
];
