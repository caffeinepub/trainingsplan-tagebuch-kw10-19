import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";

actor {
  type WeekDiary = {
    week : Nat;
    goalAchieved : Bool;
    challenges : Text;
    strategies : Text;
    notes : Text;
  };

  type TrainingSession = {
    week : Nat;
    day : Day;
    completed : Bool;
  };

  type Day = {
    #monday;
    #wednesday;
    #saturday;
  };

  module Day {
    public func compare(d1 : Day, d2 : Day) : Order.Order {
      switch (d1, d2) {
        case (#monday, #monday) { #equal };
        case (#monday, _) { #less };
        case (#wednesday, #monday) { #greater };
        case (#wednesday, #wednesday) { #equal };
        case (#wednesday, #saturday) { #less };
        case (#saturday, #saturday) { #equal };
        case (#saturday, _) { #greater };
      };
    };
  };

  let diaries = Map.empty<Principal, Map.Map<Nat, WeekDiary>>();
  let trainings = Map.empty<Principal, Map.Map<Nat, Map.Map<Day, TrainingSession>>>();

  public shared ({ caller }) func saveWeekDiary(entry : WeekDiary) : async () {
    if (entry.week < 10 or entry.week > 19) {
      Runtime.trap("Invalid week number. Must be between 10 and 19.");
    };

    let userDiaries = switch (diaries.get(caller)) {
      case (null) { Map.empty<Nat, WeekDiary>() };
      case (?d) { d };
    };

    userDiaries.add(entry.week, entry);
    diaries.add(caller, userDiaries);
  };

  public shared ({ caller }) func saveTrainingSession(session : TrainingSession) : async () {
    if (session.week < 10 or session.week > 19) {
      Runtime.trap("Invalid week number. Must be between 10 and 19.");
    };

    let userTrainings = switch (trainings.get(caller)) {
      case (null) { Map.empty<Nat, Map.Map<Day, TrainingSession>>() };
      case (?t) { t };
    };

    let weekTrainings = switch (userTrainings.get(session.week)) {
      case (null) { Map.empty<Day, TrainingSession>() };
      case (?w) { w };
    };

    weekTrainings.add(session.day, session);
    userTrainings.add(session.week, weekTrainings);
    trainings.add(caller, userTrainings);
  };

  public query ({ caller }) func getWeekDiary(week : Nat) : async WeekDiary {
    if (week < 10 or week > 19) {
      Runtime.trap("Invalid week number. Must be between 10 and 19.");
    };

    switch (diaries.get(caller)) {
      case (null) { Runtime.trap("No diary entries found for user.") };
      case (?userDiaries) {
        switch (userDiaries.get(week)) {
          case (null) { Runtime.trap("No diary entry found for this week.") };
          case (?entry) { entry };
        };
      };
    };
  };

  public query ({ caller }) func getTrainingSession(week : Nat, day : Day) : async TrainingSession {
    if (week < 10 or week > 19) {
      Runtime.trap("Invalid week number. Must be between 10 and 19.");
    };

    switch (trainings.get(caller)) {
      case (null) { Runtime.trap("No training sessions found for user.") };
      case (?userTrainings) {
        switch (userTrainings.get(week)) {
          case (null) { Runtime.trap("No training sessions found for this week.") };
          case (?weekTrainings) {
            switch (weekTrainings.get(day)) {
              case (null) { Runtime.trap("No training session found for this day.") };
              case (?session) { session };
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getTotalProgress() : async Nat {
    switch (diaries.get(caller)) {
      case (null) { 0 };
      case (?userDiaries) {
        var total = 0;
        for ((_, entry) in userDiaries.entries()) {
          if (entry.goalAchieved) {
            total += 1;
          };
        };
        total;
      };
    };
  };

  public query ({ caller }) func getAllDiaries() : async [WeekDiary] {
    switch (diaries.get(caller)) {
      case (null) { Runtime.trap("No diary entries found for user.") };
      case (?userDiaries) {
        userDiaries.values().toArray();
      };
    };
  };
};
