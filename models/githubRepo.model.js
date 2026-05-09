import mongoose from 'mongoose';

const githubRepoSchema = new mongoose.Schema(
  {
    github_id: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    full_name: {
      type: String,
      required: true,
      trim: true
    },
    html_url: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
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
    open_issues: {
      type: Number,
      default: 0
    },
    owner: {
      login: {
        type: String,
        default: ''
      },
      avatar_url: {
        type: String,
        default: ''
      },
      html_url: {
        type: String,
        default: ''
      }
    }
  },
  {
    timestamps: true
  }
);

const GithubRepo = mongoose.model('GithubRepo', githubRepoSchema);

export default GithubRepo;