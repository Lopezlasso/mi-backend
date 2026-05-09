const mongoose = require('mongoose');

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
    url: {
      type: String,
      required: true,
      trim: true
    },
    language: {
      type: String,
      default: ''
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
    owner: {
      login: {
        type: String,
        default: ''
      },
      avatarUrl: {
        type: String,
        default: ''
      },
      url: {
        type: String,
        default: ''
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('GithubRepo', githubRepoSchema);