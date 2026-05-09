import mongoose from 'mongoose';

const githubRepoSchema = new mongoose.Schema(
  {
    githubId: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    htmlUrl: {
      type: String,
      required: true
    },
    cloneUrl: {
      type: String,
      default: ''
    },
    ownerLogin: {
      type: String,
      required: true
    },
    ownerAvatarUrl: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'No especificado'
    },
    stars: {
      type: Number,
      default: 0
    },
    forks: {
      type: Number,
      default: 0
    },
    openIssues: {
      type: Number,
      default: 0
    },
    defaultBranch: {
      type: String,
      default: ''
    },
    createdAtGithub: {
      type: Date
    },
    updatedAtGithub: {
      type: Date
    },
    lastFetchedAt: {
      type: Date,
      default: Date.now
    },
    searchTerm: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const GitHubRepo = mongoose.model('GitHubRepo', githubRepoSchema);

export default GitHubRepo;
