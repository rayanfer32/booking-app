import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  required,
  NumberInput,
  SelectInput,
  ReferenceInput,
} from "react-admin";
import jsonServerProvider from "ra-data-json-server";

const dataProvider = jsonServerProvider("http://localhost:5000");

const PostCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} fullWidth />
      <TextInput source="teaser" multiline={true} label="Short description" />
      {/* <RichTextInput source="body" /> */}
      <DateInput
        label="Publication date"
        source="published_at"
        defaultValue={new Date()}
      />
    </SimpleForm>
  </Create>
);

const StaffCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="name" validate={[required()]} fullWidth />
        <TextInput source="skill" validate={[required()]} fullWidth />
        <ReferenceInput source="skill_id" reference="skills" fullWidth />
        <NumberInput source="capacity" validate={[required()]} fullWidth />
        <NumberInput source="cost" validate={[required()]} fullWidth />
      </SimpleForm>
    </Create>
  );
};

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="users" list={ListGuesser} edit={EditGuesser} />
    <Resource name="staffs" create={StaffCreate} list={ListGuesser} edit={EditGuesser} />
    {/* <Resource name="extraStaff" list={ListGuesser} edit={EditGuesser} /> */}
    <Resource name="reservations" list={ListGuesser} edit={EditGuesser} />
    <Resource name="services" list={ListGuesser} edit={EditGuesser} />
    <Resource name="skills" list={ListGuesser} edit={EditGuesser} />
  </Admin>
);

export default App;
